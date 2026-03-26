<template>
    <view class="date-cal-page">
        <uni-calendar :insert="true" :selected="selected" @change="onDateChange" @monthSwitch="onMonthSwitch" />

        <view class="list-container" v-if="currentDateList.length">
            <view class="list-title">{{ selectedDateStr }} 约会安排 ({{ currentDateList.length }}对)</view>
            <view class="record-item" v-for="item in currentDateList" :key="item.id" @tap="handleTapItem(item)">
                <view class="record-header">
                    <text class="time">约会时间：{{ item.date_time }}</text>
                </view>

                <view class="member-pair">
                    <view class="member-info">
                        <image class="avatar" :src="item.male_member?.cover?.path" mode="aspectFill"></image>
                        <view class="info-details">
                            <view class="name">{{ item.male_member?.name }}</view>
                        </view>
                    </view>
                    <view class="vs-icon">
                        <uni-icons type="heart-filled" size="24" color="#ff4d4f"></uni-icons>
                    </view>
                    <view class="member-info right" style="justify-content: flex-end;">
                        <view class="info-details" style="text-align: right; padding-right: 20rpx;">
                            <view class="name">{{ item.female_member?.name }}</view>
                        </view>
                        <image class="avatar" style="margin-right: 0;" :src="item.female_member?.cover?.path"
                            mode="aspectFill"></image>
                    </view>
                </view>

                <view class="chat-eval-container" v-if="item.man_to_woman_level || item.woman_to_man_level">
                    <view class="eval-bubble left-bubble" v-if="item.man_to_woman_level">
                        <text class="bubble-label">他对她：</text>
                        <text class="bubble-value" :class="'text-level-' + item.man_to_woman_level">{{
                            item.man_to_woman_level_text }}</text>
                    </view>
                    <view class="eval-bubble right-bubble" v-if="item.woman_to_man_level">
                        <text class="bubble-label">她对他：</text>
                        <text class="bubble-value" :class="'text-level-' + item.woman_to_man_level">{{
                            item.woman_to_man_level_text }}</text>
                    </view>
                </view>

                <view class="remark" v-if="item.remark">
                    备注：{{ item.remark }}
                </view>
            </view>
        </view>
        <view class="empty-tip" v-else>
            {{ selectedDateStr || '当天' }} 暂无约会安排
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getDateListApi } from '@/api/date';
import useDict from '@/hooks/useDict';

const allDateList = ref<any[]>([]);
const selectedDateStr = ref('');
const currentRangeKey = ref('');

const formatDate = (year: number, month: number, date: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
}

const getVisibleRange = (year: number, month: number) => {
    const startDate = formatDate(year, month - 1, 1);
    const endDate = formatDate(year, month + 1, new Date(year, month + 1, 0).getDate());
    return {
        startDate,
        endDate,
        key: `${startDate}_${endDate}`
    };
}

const fetchDateList = (year: number, month: number) => {
    const { startDate, endDate, key } = getVisibleRange(year, month);
    if (key === currentRangeKey.value) return;
    currentRangeKey.value = key;

    getDateListApi({
        start_date: startDate,
        end_date: endDate
    }).then((res) => {
        allDateList.value = res;
    })
}

const selected = computed(() => {
    const map = new Map<string, number>();
    allDateList.value.forEach(item => {
        if (item.date_time) {
            const date = item.date_time.split(' ')[0];
            map.set(date, (map.get(date) || 0) + 1);
        }
    });

    const res: any[] = [];
    map.forEach((count, date) => {
        res.push({
            date: date,
            info: `${count}对`
        });
    });
    return res;
});

const currentDateList = computed(() => {
    if (!selectedDateStr.value) return [];
    return allDateList.value.filter(item => item.date_time?.startsWith(selectedDateStr.value));
});

const onDateChange = (e: any) => {
    selectedDateStr.value = formatDate(e.year, e.month, e.date);
};

const onMonthSwitch = (e: any) => {
    const range = getVisibleRange(e.year, e.month);
    if (range.key === currentRangeKey.value) return;
    fetchDateList(e.year, e.month);
};

const handleTapItem = (item: any) => {
    uni.navigateTo({
        url: '/pages/date/detail?id=' + item.id
    })
}

onLoad(() => {
    const today = new Date();
    selectedDateStr.value = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    fetchDateList(today.getFullYear(), today.getMonth() + 1);
});
</script>

<style lang="scss" scoped>
.date-cal-page {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.list-container {
    padding: 20rpx;
}

.list-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin: 20rpx 0;
    padding-left: 10rpx;
    border-left: 8rpx solid #2979ff;
    line-height: 1;
}

.record-item {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.record-header {
    margin-bottom: 24rpx;
    border-bottom: 1rpx dashed #eee;
    padding-bottom: 16rpx;
}

.time {
    font-size: 26rpx;
    color: #666;
}

.member-pair {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.member-info {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
}

.avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 4px;
    margin-right: 20rpx;
    background-color: #eee;
    flex-shrink: 0;
}

.info-details {
    flex: 1;
    overflow: hidden;
}

.name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
}

.chat-eval-container {
    margin-top: 18rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 16rpx;
}

.eval-bubble {
    display: inline-flex;
    align-items: center;
    padding: 12rpx 24rpx;
    font-size: 24rpx;
    max-width: 48%;
    position: relative;
}

.left-bubble {
    background-color: #f0f7ff;
    border-radius: 4rpx 30rpx 30rpx 30rpx;
}

.right-bubble {
    margin-left: auto;
    background-color: #fff0f6;
    border-radius: 30rpx 4rpx 30rpx 30rpx;
}

.bubble-label {
    color: #666;
}

.bubble-value {
    font-weight: bold;
}

.text-level-1 {
    color: #ff4d4f;
}

.text-level-2 {
    color: #faad14;
}

.text-level-3 {
    color: #52c41a;
}

.vs-icon {
    padding: 0 20rpx;
}

.remark {
    font-size: 26rpx;
    color: #666;
    margin-top: 16rpx;
}

.empty-tip {
    text-align: center;
    color: #999;
    font-size: 28rpx;
    padding: 60rpx 0;
}
</style>