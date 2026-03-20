<template>
    <view class="pro-combox">
        <view class="selector">
            <view class="prefix">
                <uni-icons type="search" size="16" color="#999" />
            </view>
            <input class="selector-input" type="text" v-model="keyword" :placeholder="currentPlaceholder"
                @focus="handleFocus" />
            <view v-if="clearable && modelValue !== ''" class="suffix" @tap.stop="clear">
                <uni-icons type="clear" size="20" color="#c0c4cc" />
            </view>
            <view v-else class="suffix">
                <uni-icons type="down" size="16" color="#999" />
            </view>
        </view>
        <view v-if="open" class="mask" @tap="close"></view>
        <view v-if="keyword && open" class="dropdown" @tap.stop>
            <scroll-view class="option-list" scroll-y>
                <view v-for="item in filteredOptions" :key="String(item.value)" class="option-item"
                    :class="{ active: item.value === modelValue }" @tap="select(item)">
                    {{ item.label }}
                </view>
                <view v-if="filteredOptions.length === 0" class="empty">无匹配数据</view>
            </scroll-view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type ComboxOption = {
    label: string
    value: string | number
}

const props = withDefaults(defineProps<{
    options: ComboxOption[]
    placeholder?: string
    clearable?: boolean
}>(), {
    options: () => [],
    placeholder: '请选择',
    clearable: true
})

const emit = defineEmits<{
    (e: 'change', value: string | number | ''): void
}>()

const modelValue = defineModel<string | number | ''>({ default: '' })

const open = ref(false)
const keyword = ref('')

const selectedLabel = computed(() => {
    const current = props.options.find((item) => item.value === modelValue.value)
    return current?.label ?? ''
})

const currentPlaceholder = computed(() => {
    return selectedLabel.value || props.placeholder
})

const filteredOptions = computed(() => {
    const search = keyword.value.trim().toLowerCase()
    if (!search) return []
    return props.options.filter((item) => item.label.toLowerCase().includes(search))
})

watch(selectedLabel, (newLabel) => {
    if (!open.value) {
        keyword.value = newLabel
    }
}, { immediate: true })

const handleFocus = () => {
    open.value = true
    keyword.value = ''
}

const close = () => {
    open.value = false
    keyword.value = selectedLabel.value
}

const select = (item: ComboxOption) => {
    modelValue.value = item.value
    emit('change', item.value)
    close()
}

const clear = () => {
    console.log('clear')
    modelValue.value = ''
    keyword.value = ''
    open.value = false
    emit('change', '')
}
</script>

<style scoped lang="scss">
.pro-combox {
    position: relative;

    .selector {
        display: flex;
        align-items: center;
        min-height: 35px;
        padding: 0 10px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        background-color: #fff;
        box-sizing: border-box;

        .prefix {
            width: 20px;
            height: 28px;
            margin-right: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .selector-input {
            flex: 1;
            height: 33px;
            color: #333;
            font-size: 14px;
            min-width: 0;
        }

        .suffix {
            width: 28px;
            height: 28px;
            margin-left: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
    }

    .mask {
        position: fixed;
        inset: 0;
        z-index: 98;
    }

    .dropdown {
        position: absolute;
        z-index: 99;
        left: 0;
        right: 0;
        margin-top: 6px;
        padding: 8px;
        border: 1px solid #ebeef5;
        border-radius: 6px;
        background-color: #fff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        .option-list {
            max-height: 240px;
        }

        .option-item {
            padding: 10px 8px;
            font-size: 14px;
            color: #333;
            border-radius: 4px;
        }

        .active {
            color: #2979ff;
            background: rgba(41, 121, 255, 0.08);
        }

        .empty {
            padding: 12px 8px;
            text-align: center;
            color: #999;
            font-size: 13px;
        }
    }
}
</style>