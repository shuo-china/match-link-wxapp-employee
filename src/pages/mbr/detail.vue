<template>
    <view class="container">
        <view v-if="data">
            <uni-section title="基础信息" type="line">
                <uni-card margin="0 12px 6px" spacing="0" padding="0 8px">
                    <uni-list :border="false" class="list-wrapper">
                        <uni-list-item title="姓名" :rightText="data.name" />
                        <uni-list-item title="性别" :rightText="getOptionLabelByValue(dict?.gender, data.gender)" />
                        <uni-list-item title="手机号" :rightText="data.mobile" />
                        <uni-list-item title="年龄" :rightText="data.age + '岁  ' + ' / ' + data.birthYear + '年'" />
                        <uni-list-item title="身高" :rightText="data.height + 'cm'" />
                        <uni-list-item title="学历" :rightText="getOptionLabelByValue(dict?.education, data.education)" />
                        <uni-list-item title="行业" :rightText="getOptionLabelByValue(dict?.industry, data.industry)" />
                        <uni-list-item title="职业" :rightText="data.occupation" />
                        <uni-list-item title="相册">
                            <template #footer>
                                <pro-upload v-model="data.albums" :disabled="true" />
                            </template>
                        </uni-list-item>
                    </uni-list>
                </uni-card>
            </uni-section>

            <uni-section title="家庭情况" type="line">
                <uni-card margin="0 12px 6px" spacing="0" :padding="data.hasChildren ? '0 8px 15px' : '0 8px'">
                    <uni-list :border="false" class="list-wrapper">
                        <uni-list-item title="居住地" :rightText="data.currentAddress?.join('/')" />
                        <uni-list-item title="老家" :rightText="data.permanentAddress?.join('/')" />
                        <uni-list-item title="家庭成员"
                            :rightText="data.familys?.map(item => getOptionLabelByValue(dict?.family, item)).join('，')" />
                        <uni-list-item title="婚姻状态"
                            :rightText="getOptionLabelByValue(dict?.marital_status, data.maritalStatus)" />
                        <uni-list-item title="是否有孩子"
                            :rightText="getOptionLabelByValue(whetherOptions, data.hasChildren)" />
                        <uni-table v-if="data.hasChildren" border>
                            <uni-tr>
                                <uni-th width="50" align="center">序号</uni-th>
                                <uni-th width="100" align="center">孩子性别</uni-th>
                                <uni-th width="120" align="center">孩子跟谁</uni-th>
                            </uni-tr>
                            <uni-tr v-for="(item, index) in data.childrens" :key="index">
                                <uni-td align="center">{{ index as number + 1 }}</uni-td>
                                <uni-td align="center">{{ getOptionLabelByValue(childGenderOptions, item.gender)
                                }}</uni-td>
                                <uni-td align="center">{{ getOptionLabelByValue(childCustodyOptions, item.custody)
                                }}</uni-td>
                            </uni-tr>
                        </uni-table>
                    </uni-list>
                </uni-card>
            </uni-section>

            <uni-section title="经济条件" type="line">
                <uni-card margin="0 12px 6px" spacing="0" padding="0 8px">
                    <uni-list :border="false" class="list-wrapper">
                        <uni-list-item title="年收入" :rightText="data.annualIncome + '万元'" />
                        <uni-list-item title="是否有房" :rightText="getOptionLabelByValue(whetherOptions, data.hasHouse)" />
                        <uni-list-item v-if="data.hasHouse === 1" title="房子数量" :rightText="data.houseCount + '套'" />
                        <uni-list-item title="是否有车"
                            :rightText="getOptionLabelByValue(whetherOptions, data.hasVehicle)" />
                    </uni-list>
                </uni-card>
            </uni-section>

            <uni-section title="其他" type="line">
                <uni-card margin="0 12px 6px" spacing="0" padding="0 8px">
                    <uni-list :border="false" class="list-wrapper">
                        <uni-list-item title="备注" :rightText="data.remark" />
                        <uni-list-item title="添加员工" :rightText="data.employee?.nickname" />
                        <uni-list-item title="创建时间" :rightText="data.create_time" />
                    </uni-list>
                </uni-card>
            </uni-section>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { getMbrDetailApi } from '@/api/mbr';
import useRequest from '@/hooks/useRequest';
import useDict from '@/hooks/useDict';
import { childCustodyOptions, childGenderOptions, getOptionLabelByValue, whetherOptions } from '@/utils/options';

const { dict } = useDict(['gender', 'industry', 'marital_status', 'education', 'family'])

const { run, data } = useRequest(getMbrDetailApi, {
    manual: true
})

onLoad((options) => {
    if (options?.id) {
        uni.showLoading({
            title: '加载中'
        })
        run({
            id: options.id
        }).finally(() => {
            uni.hideLoading()
        })
    }
})
</script>

<style lang="scss" scoped>
.container {
    padding-bottom: 12px;

    .list-wrapper {
        :deep(.uni-list-item__extra-text) {
            color: #333;
            font-size: 14px;
        }

        :deep(.uni-list-item__content) {
            flex: 1 0 auto;
        }
    }
}
</style>