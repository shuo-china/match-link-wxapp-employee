<template>
  <view class="container">
    <view class="title">功能列表</view>
    <view class="fns-wrapper">
      <view v-for="(item, index) in fnList" :index="index" :key="index" class="fns-item" @tap="handleTapFnItem(item)">
        <uni-icons :type="item.icon" size="36"></uni-icons>
        <text class="text">{{ item.text }}</text>
      </view>
    </view>

  </view>

</template>

<script setup lang="ts">
const fnList = [
  {
    icon: "person",
    text: "会员列表",
    link: '/pages/mbr/list'
  },
  {
    icon: "personadd",
    text: "添加会员",
    link: '/pages/mbr/form'
  },
]

const handleTapFnItem = (item) => {
  uni.navigateTo({
    url: item.link
  })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 12px;
  min-height: 100vh;
  background-color: #f5f5f5;

  .title {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 15px;
  }

  .fns-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 12px;

    .fns-item {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      row-gap: 3px;
      padding: 10px 0;
      border-radius: 3px;
      background-color: #fff;
      font-size: 15px;
      box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
    }
  }
}
</style>