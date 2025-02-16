<template>
  <div>
    <SchemaForm
      v-if="search"
      ref="queryFormRef"
      class="bg-white dark:bg-black mb-16px !pt-24px pr-24px"
      submit-on-reset
      v-bind="getFormProps"
      :table-instance="tableAction"
      @toggle-advanced="(e) => $emit('toggle-advanced', e)"
      @submit="handleSubmit"
    >
      <template v-for="item of getFormSlotKeys" #[replaceFormSlotKey(item)]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </SchemaForm>
    <div class="bg-white dark:bg-black">
      <ToolBar
        v-if="showToolBar"
        :export-file-name="exportFileName"
        :title="headerTitle"
        :title-tooltip="titleTooltip"
        :show-table-setting="showTableSetting"
      >
        <template v-for="name of Object.keys($slots)" #[name]="data">
          <slot :name="name" v-bind="data || {}"></slot>
        </template>
      </ToolBar>
      <SchemaForm
        ref="editTableFormRef"
        no-style
        :initial-values="editFormModel"
        :show-action-button-group="false"
        :show-advanced-button="false"
        @validate="handleEditFormValidate"
      >
        <Table
          ref="tableRef"
          v-bind="getBindValues"
          :columns="innerColumns"
          :data-source="tableData"
          @change="handleTableChange"
        >
          <template v-for="(_, slotName) of $slots" #[slotName]="slotData" :key="slotName">
            <slot :name="slotName" v-bind="slotData"></slot>
          </template>
          <template #bodyCell="slotData">
            <slot name="bodyCell" v-bind="slotData"></slot>
          </template>
        </Table>
      </SchemaForm>
    </div>
  </div>
</template>

<script lang="tsx" setup>
  import { useSlots } from 'vue';
  import { Table } from 'ant-design-vue';
  import {
    useTableMethods,
    createTableContext,
    useExportData2Excel,
    useTableForm,
    useTableState,
    useColumns,
    useEditable,
  } from './hooks';
  import { ToolBar } from './components';
  import { dynamicTableProps, dynamicTableEmits } from './dynamic-table';
  import type { TableActionType } from './types';
  import { SchemaForm } from '@/components/core/schema-form';

  defineOptions({
    name: 'DynamicTable',
    inheritAttrs: false,
  });

  const props = defineProps(dynamicTableProps);
  const emit = defineEmits(dynamicTableEmits);
  const slots = useSlots();

  // 表格内部状态
  const tableState = useTableState({ props, slots });
  const { tableData, queryFormRef, editTableFormRef, getBindValues, editFormModel } = tableState;
  // 表格内部方法
  const tableMethods = useTableMethods({ state: tableState, props, emit });
  const { setProps, fetchData, handleSubmit, reload, handleTableChange, handleEditFormValidate } =
    tableMethods;
  // 控制编辑行
  const editableHooks = useEditable({ props, state: tableState });

  const tableAction: TableActionType = {
    setProps,
    reload,
    fetchData,
    ...editableHooks,
  };

  // 表格列的配置描述
  const { innerColumns } = useColumns({
    props,
    slots,
    state: tableState,
    methods: tableMethods,
    tableAction,
  });

  // 搜索表单
  const { getFormProps, replaceFormSlotKey, getFormSlotKeys } = useTableForm({
    tableState,
    tableMethods,
    slots,
  });

  // 表单导出
  const exportData2ExcelHooks = useExportData2Excel({
    props,
    state: tableState,
    methods: tableMethods,
  });

  // 当前组件所有的状态和方法
  const instance = {
    ...props,
    ...tableState,
    ...tableMethods,
    ...editableHooks,
    ...exportData2ExcelHooks,
    emit,
  };

  createTableContext(instance);

  fetchData();

  defineExpose(instance);
</script>

<style lang="less" scoped>
  :deep(.ant-table-wrapper) {
    padding: 0 6px 6px 6px;

    .ant-table {
      .ant-table-title {
        display: flex;
      }

      .ant-image:hover {
        cursor: zoom-in;
      }

      .ant-btn {
        margin-right: 10px;
      }
    }
  }

  .actions > * {
    margin-right: 10px;
  }
</style>
