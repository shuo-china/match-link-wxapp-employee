<template>
    <view class="data-input">
        <text class="selected-area" :class="{ 'placeholder': isEmptyValue }">
            {{ isEmptyValue ? '请选择' : displayValue }}
        </text>
        <uni-icons v-if="isEmptyValue" type="down" size="16" color="#999"></uni-icons>
        <uni-icons v-else type="clear" size="24" color="#c0c4cc" @tap.stop="clear"></uni-icons>
    </view>
</template>

<script setup lang="ts">
const emit = defineEmits(['clear'])

defineProps<{
    isEmptyValue: boolean
    displayValue: string
}>()

const clear = () => {
    emit('clear')
}
</script>

<style lang="scss" scoped>
.data-input {
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 5px;
    color: #333;
    font-size: 14px;
    height: 35px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    background-color: #fff;
    box-sizing: border-box;
    line-height: 1;

    .selected-area {
        flex: 1;
    }

    .placeholder {
        color: grey;
        font-size: 12px;
    }
}
</style>
