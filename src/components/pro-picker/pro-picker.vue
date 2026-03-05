<template>
    <picker v-if="mode === 'selector'" mode="selector" :range="options" range-key="text"
        :value="isEmptyValue ? currentInitValue : currentValue" @change="handleSelectorChange">
        <slot>
            <pro-picker-input :is-empty-value="isEmptyValue" :display-value="displayValue" @clear="clear" />
        </slot>
    </picker>
    <picker v-else :mode="mode" :value="isEmptyValue ? currentInitValue : currentValue" @change="handleChange">
        <slot>
            <pro-picker-input :is-empty-value="isEmptyValue" :display-value="displayValue" @clear="clear" />
        </slot>
    </picker>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import proPickerInput from './pro-picker-input.vue'

const emit = defineEmits(['change'])

const props = defineProps<{
    initValue?: any
    mode: 'selector' | 'date' | 'region'
    options?: OptionItem[]
}>()

const modelValue = defineModel<any>()

const isEmptyValue = computed(() => {
    if (Array.isArray(modelValue.value)) {
        return modelValue.value.length === 0
    }
    return !modelValue.value
})

const currentValue = computed(() => {
    if (props.mode === 'selector' && Array.isArray(props.options)) {
        return props.options.findIndex((item) => item.value === modelValue.value)
    }
    return modelValue.value
})

const currentInitValue = computed(() => {
    if (props.mode === 'selector' && Array.isArray(props.options)) {
        const index = props.options.findIndex((item) => item.value === props.initValue)
        return index !== -1 ? index : 0
    }
    return props.initValue || ''
})

const displayValue = computed(() => {
    if (Array.isArray(modelValue.value)) {
        if (props.mode === 'region') {
            return modelValue.value?.join('/')
        }
    }
    if (props.mode === 'selector' && Array.isArray(props.options)) {
        return props.options?.[currentValue.value]?.text
    }
    return modelValue.value
})

const handleSelectorChange = (e) => {
    const index = Number(e.detail.value)
    const value = props.options?.[index]?.value || ''
    modelValue.value = value
    emit('change', value)
}

const handleChange = (e) => {
    const value = e.detail.value
    modelValue.value = value
    emit('change', value)
}

const clear = () => {
    let value
    if (props.mode === 'region') {
        value = []
    } else {
        value = ''
    }
    modelValue.value = value
    emit('change', value)
}
</script>
