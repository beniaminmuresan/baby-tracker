<script setup>
  import { reactive, watch } from 'vue';
  import Button from 'primevue/button';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import RadioButton from 'primevue/radiobutton';
  import moment from 'moment';

  const trackingData = reactive(JSON.parse(localStorage.getItem('trackingData')) || []);
  const markPoo = () => {
    trackingData.push({ trackingType: 'Poo', timestamp: Date.now() });
  }
  const markPee = () => {
    trackingData.push({ trackingType: 'Pee',  timestamp: Date.now() });
  }
  const markStartFeeding = () => {
    trackingData.push({ trackingType: 'Feed', timestamp: Date.now(), endTimestamp: null });
  }

  const finishFeeding = (timestamp) => {
    const trackingIndex = JSON.parse(localStorage.getItem('trackingData')).findIndex(key => key.timestamp == timestamp);
    trackingData[trackingIndex].endTimestamp = Date.now();
  }

  watch(trackingData, (newtrackingData) => {
    localStorage.setItem('trackingData', JSON.stringify(newtrackingData));
  })
</script>

<template>
  <div class="card flex justify-content-center flex-wrap gap-5">
    <Button label="Poo" severity="danger" @click="markPoo" />
    <Button label="Pee" severity="warning" @click="markPee" />
    <Button label="Eat" @click="markStartFeeding" />
  </div>

  <br>
  <DataTable :value="trackingData" sortField="timestamp" :sortOrder="-1">
    <Column header="Tip">
      <template #body="slotProps">
        <img alt="etc" :src="`${slotProps.data.trackingType}.png`" style="height: 50px;"/>
      </template>
    </Column>
    <Column header="Time">
      <template #body="slotProps">
        {{ moment(slotProps.data.timestamp).format('HH:mm (DD MMM)') }}
      </template>
    </Column>
    <Column header="">
      <template #body="slotProps">
        <div v-if="slotProps.data.trackingType == 'Feed'">
          <div v-if="slotProps.data.endTimestamp == null">
            <div class="flex align-items-center">
            <RadioButton v-model="slotProps.data.feedSide" inputId="leftSide" name="feedSide" value="L" />
            <label for="leftSide" class="ml-2">Left</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton v-model="slotProps.data.feedSide" inputId="rightSide" name="feedSide" value="R" />
            <label for="rightSide" class="ml-2">Right</label>
          </div>
            <Button label="Finish" @click="finishFeeding(slotProps.data.timestamp)" />
          </div>
          <div v-if="slotProps.data.endTimestamp != null">
            {{
              Math.ceil(moment.duration((moment(slotProps.data.endTimestamp)).diff(moment(slotProps.data.timestamp))).asMinutes())
            }} min  {{ (slotProps.data.feedSide != null) ?  `- ${slotProps.data.feedSide}` : '' }}
          </div>
        </div>
      </template>
    </Column>
  </DataTable>
</template>
