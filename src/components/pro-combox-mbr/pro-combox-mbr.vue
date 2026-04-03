<template>
    <view class="pro-combox">
        <view class="selector">
            <view class="prefix">
                <uni-icons type="search" size="16" color="#999" />
            </view>
            <input class="selector-input" type="text" v-model="keyword" :placeholder="currentPlaceholder"
                @focus="handleFocus" />
            <view v-if="clearable && modelValue !== null" class="suffix" @tap.stop="clear">
                <uni-icons type="clear" size="20" color="#c0c4cc" />
            </view>
            <view v-else class="suffix">
                <uni-icons type="down" size="16" color="#999" />
            </view>
        </view>
        <view v-if="open" class="mask" @tap="close"></view>
        <view v-if="open" class="dropdown" @tap.stop>
            <scroll-view class="option-list" scroll-y>
                <view v-for="item in filteredOptions" :key="item.id" class="option-item"
                    :class="{ active: item.id === modelValue }" @tap="select(item)">
                    <view class="option-avatar">
                        <image v-if="item.cover" :src="item.cover" mode="aspectFill" lazy-load />
                        <view v-else class="avatar-placeholder">
                            <uni-icons type="person-filled" size="20" color="#fff"></uni-icons>
                        </view>
                    </view>
                    <view class="option-content">
                        <view class="option-name">{{ item.name }}</view>
                        <view class="option-mobile">{{ item.mobile }}</view>
                    </view>
                    <uni-icons v-if="item.id === modelValue" type="checkmarkempty" size="18" color="#2979ff"
                        class="check-icon" />
                </view>
                <view v-if="filteredOptions.length === 0" class="empty">无匹配数据</view>
            </scroll-view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getMbrOptionsApi } from '@/api/mbr';
import useRequest from '@/hooks/useRequest';
import { computed, ref, watch } from 'vue'

type ComboxOption = {
    id: number
    name: string
    mobile: string
    cover: string
}

const props = withDefaults(defineProps<{
    requestParams: () => Record<string, any> | undefined
    placeholder?: string
    clearable?: boolean
}>(), {
    placeholder: '请选择',
    clearable: true
})

const emit = defineEmits<{
    (e: 'change', value: number | null): void
}>()

const modelValue = defineModel<number | null>({ default: null })

const { data: options } = useRequest(() => getMbrOptionsApi(props.requestParams?.() ?? {}))

const open = ref(false)
const keyword = ref('')

const selectedLabel = computed(() => {
    const list = options.value || []
    const current = list.find((item) => item.id === modelValue.value)
    return current ? `${current?.name} - ${current?.mobile}` : ''
})

const currentPlaceholder = computed(() => {
    return selectedLabel.value || props.placeholder
})

const filteredOptions = computed(() => {
    const search = keyword.value.trim().toLowerCase()
    if (!search) return options.value || []
    const list = options.value || []
    return list.filter((item) => item.name.toLowerCase().includes(search) || item.mobile.toLowerCase().includes(search))
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
    modelValue.value = item.id
    emit('change', item.id)
    close()
}

const clear = () => {
    modelValue.value = null
    keyword.value = ''
    open.value = false
    emit('change', null)
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
            padding: 10px 12px;
            font-size: 14px;
            color: #333;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            line-height: 1.2;
            margin-bottom: 4px;
            transition: all 0.2s;

            &:last-child {
                margin-bottom: 0;
            }

            .option-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                overflow: hidden;
                flex-shrink: 0;
                background-color: #f5f5f5;

                image {
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    background-color: #ccc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            .option-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 2px;

                .option-name {
                    font-size: 15px;
                    font-weight: 500;
                    color: #333;
                }

                .option-mobile {
                    font-size: 12px;
                    color: #666;
                }
            }

            .check-icon {
                margin-left: auto;
            }
        }

        .active {
            color: #2979ff;
            background: rgba(41, 121, 255, 0.08);

            .option-content {
                .option-name {
                    color: #2979ff;
                }

                .option-mobile {
                    color: rgba(41, 121, 255, 0.7);
                }
            }
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