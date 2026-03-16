<template>
    <view class="pro-slider-range" @touchmove.stop.prevent="onWrapperMove" @touchend="onWrapperEnd"
        @touchcancel="onWrapperEnd">
        <view class="pro-slider-range__track" :style="trackStyle" @tap="onTrackTap">
            <view class="pro-slider-range__track-bg" :style="trackBgStyle"></view>
            <view class="pro-slider-range__track-active" :style="activeStyle"></view>
            <view class="pro-slider-range__thumb" :style="leftThumbStyle"
                @touchstart.stop.prevent="onThumbStart('left')"></view>
            <view class="pro-slider-range__thumb" :style="rightThumbStyle"
                @touchstart.stop.prevent="onThumbStart('right')"></view>
        </view>
        <view v-if="showValue" class="pro-slider-range__value">{{ displayText }}</view>
    </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';

type RangeValue = [number | null, number | null];
interface TrackRect {
    left: number;
    width: number;
}
interface Props {
    modelValue?: RangeValue;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    activeColor?: string;
    backgroundColor?: string;
    blockColor?: string;
    blockSize?: number;
    minUnlimited?: boolean;
    maxUnlimited?: boolean;
    showValue?: boolean;
    valueFormatter?: (value: number) => string | number;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [0, 100], min: 0, max: 100, step: 1, disabled: false,
    activeColor: '#007aff', backgroundColor: '#e5e5ea', blockColor: '#ffffff', blockSize: 30,
    minUnlimited: false, maxUnlimited: false, showValue: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: RangeValue): void;
    (e: 'change', value: RangeValue): void;
    (e: 'changing', value: RangeValue): void;
}>();

const instance = getCurrentInstance();
const dragging = ref<'left' | 'right' | null>(null);
const trackRect = ref<TrackRect | null>(null);
const leftValue = ref(0);
const rightValue = ref(100);

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
const safeStep = computed(() => {
    const step = Number(props.step);
    return step > 0 ? step : 1;
});
const realMin = computed(() => (props.minUnlimited ? props.min - safeStep.value : props.min));
const realMax = computed(() => (props.maxUnlimited ? props.max + safeStep.value : props.max));
const valueRange = computed(() => realMax.value - realMin.value || 1);
const snap = (val: number) => realMin.value + Math.round((val - realMin.value) / safeStep.value) * safeStep.value;
const toPercent = (v: number) => ((v - realMin.value) / valueRange.value) * 100;
const toOutput = (v: number, side: 'left' | 'right') => (side === 'left' && props.minUnlimited && v <= realMin.value) || (side === 'right' && props.maxUnlimited && v >= realMax.value) ? null : v;

const normalizeModel = (value?: RangeValue) => {
    const l = value?.[0] === null && props.minUnlimited ? realMin.value : (value?.[0] ?? props.min);
    const r = value?.[1] === null && props.maxUnlimited ? realMax.value : (value?.[1] ?? props.max);
    const left = clamp(snap(l), realMin.value, realMax.value);
    const right = clamp(snap(r), realMin.value, realMax.value);
    return left <= right ? [left, right] : [right, left];
};

const outputValue = computed<RangeValue>(() => [toOutput(leftValue.value, 'left'), toOutput(rightValue.value, 'right')]);
const leftPercent = computed(() => toPercent(leftValue.value));
const rightPercent = computed(() => toPercent(rightValue.value));
const leftRatio = computed(() => clamp(leftPercent.value / 100, 0, 1));
const rightRatio = computed(() => clamp(rightPercent.value / 100, 0, 1));

const trackStyle = computed(() => ({
    height: `${Math.max(props.blockSize, 30)}px`
}));

const trackBgStyle = computed(() => ({ backgroundColor: props.backgroundColor }));
const leftThumbStyle = computed(() => ({ left: `calc((100% - ${props.blockSize}px) * ${leftRatio.value})`, width: `${props.blockSize}px`, height: `${props.blockSize}px`, backgroundColor: props.blockColor }));
const rightThumbStyle = computed(() => ({ left: `calc((100% - ${props.blockSize}px) * ${rightRatio.value})`, width: `${props.blockSize}px`, height: `${props.blockSize}px`, backgroundColor: props.blockColor }));
const activeStyle = computed(() => ({ left: `calc((100% - ${props.blockSize}px) * ${leftRatio.value} + ${props.blockSize / 2}px)`, width: `calc((100% - ${props.blockSize}px) * ${Math.max(0, rightRatio.value - leftRatio.value)})`, backgroundColor: props.activeColor }));
const formatDisplayValue = (value: number | null) => {
    if (value === null) {
        return '不限';
    }
    const formatted = props.valueFormatter?.(value);
    return formatted ?? value;
};
const displayText = computed(() => `${formatDisplayValue(outputValue.value[0])} - ${formatDisplayValue(outputValue.value[1])}`);

const syncFromModel = () => { const [l, r] = normalizeModel(props.modelValue); leftValue.value = l; rightValue.value = r; };
const updateTrackRect = () => new Promise<void>((resolve) => {
    uni.createSelectorQuery().in(instance?.proxy).select('.pro-slider-range__track').boundingClientRect((rect: any) => {
        if (rect && typeof rect.left === 'number' && typeof rect.width === 'number') {
            trackRect.value = { left: rect.left, width: rect.width };
        } else {
            trackRect.value = null;
        }
        resolve();
    }).exec();
});
const getClientX = (e: any) => {
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0];
    if (typeof touch?.clientX === 'number') return touch.clientX;
    if (typeof e?.detail?.x === 'number') return e.detail.x;
    return null;
};
const getRatioByClientX = (x: number) => {
    if (!trackRect.value?.width) return null;
    const usableWidth = Math.max(trackRect.value.width - props.blockSize, 1);
    const startX = trackRect.value.left + props.blockSize / 2;
    return clamp((x - startX) / usableWidth, 0, 1);
};
const updateByClientX = (x: number, isChange = false) => {
    if (props.disabled || !dragging.value) return;
    const ratio = getRatioByClientX(x);
    if (ratio === null) return;
    const next = clamp(snap(realMin.value + ratio * valueRange.value), realMin.value, realMax.value);

    if (dragging.value === 'left') {
        if (next <= rightValue.value) {
            leftValue.value = next;
        } else {
            leftValue.value = rightValue.value;
            rightValue.value = next;
            dragging.value = 'right';
        }
    } else {
        if (next >= leftValue.value) {
            rightValue.value = next;
        } else {
            rightValue.value = leftValue.value;
            leftValue.value = next;
            dragging.value = 'left';
        }
    }

    emit('update:modelValue', outputValue.value);
    if (isChange) {
        emit('change', outputValue.value);
    } else {
        emit('changing', outputValue.value);
    }
};

const onThumbStart = async (side: 'left' | 'right') => {
    if (props.disabled) return;
    dragging.value = side;
    await updateTrackRect();
};
const onWrapperMove = (e: any) => {
    const x = getClientX(e);
    if (typeof x === 'number') updateByClientX(x);
};
const onWrapperEnd = () => { if (!dragging.value) return; emit('update:modelValue', outputValue.value); emit('change', outputValue.value); dragging.value = null; };
const onTrackTap = async (e: any) => {
    if (props.disabled) return;
    await updateTrackRect();
    const x = getClientX(e);
    if (typeof x !== 'number') return;
    const ratio = getRatioByClientX(x);
    if (ratio === null) return;
    const current = ratio * 100;
    dragging.value = Math.abs(leftPercent.value - current) <= Math.abs(rightPercent.value - current) ? 'left' : 'right';
    updateByClientX(x, true);
    dragging.value = null;
};

watch(() => props.modelValue, syncFromModel, { deep: true, immediate: true });
watch(() => [props.min, props.max, props.step, props.minUnlimited, props.maxUnlimited], async () => {
    syncFromModel();
    await nextTick();
    await updateTrackRect();
});
onMounted(async () => { await nextTick(); syncFromModel(); await updateTrackRect(); });
</script>

<style lang="scss" scoped>
.pro-slider-range {
    width: 100%;
    display: flex;
    align-items: center;

    &__track {
        position: relative;
        flex: 1;
    }

    &__track-bg,
    &__track-active {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 6px;
        border-radius: 999px;
    }

    &__track-bg {
        left: 0;
        right: 0;
    }

    &__track-active {
        z-index: 1;
    }

    &__thumb {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        z-index: 2;

        &::before,
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 2px;
            height: 10px;
            border-radius: 1px;
            background-color: #007aff;
            transform: translateY(-50%);
        }

        &::before {
            left: calc(50% - 4px);
        }

        &::after {
            left: calc(50% + 2px);
        }
    }

    &__value {
        margin-left: 8px;
        color: #666;
        font-size: 13px;
        text-align: right;
        white-space: nowrap;
        min-width: 72px;
    }
}
</style>