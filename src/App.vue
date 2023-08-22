<script setup>
  import { reactive } from 'vue';
  import Button from 'primevue/button';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import moment from 'moment';

  const trackingData = reactive(JSON.parse(localStorage.getItem('trackingData')) || []);
  const markPoo = () => {
    let currentDate = new Date();
    trackingData.push({ trackingType: 'Poo', timestamp: currentDate.valueOf() });
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
  }
  const markPee = () => {
    let currentDate = new Date();
    trackingData.push({ trackingType: 'Pee',  timestamp: currentDate.valueOf() });
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
  }
  const markStartFeeding = () => {
    let currentDate = new Date();
    trackingData.push({ trackingType: 'Feed', timestamp: currentDate.valueOf(), endTimestamp: null });
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
  }

  const finishFeeding = (timestamp) => {
    const trackingIndex = JSON.parse(localStorage.getItem('trackingData')).findIndex(key => key.timestamp == timestamp);
    trackingData[trackingIndex].endTimestamp = Date.now();
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
  }

</script>

<template>
  <Button label="Poo" @click="markPoo" />
  <Button label="Pee" @click="markPee" />
  <Button label="Eat" @click="markStartFeeding" />
  <br>
  <DataTable :value="trackingData" sortField="timestamp" :sortOrder="-1">
    <Column field="trackingType" header="Tip"></Column>
    <Column header="Time">
      <template #body="slotProps">
        {{ moment(slotProps.data.timestamp).format('HH:mm (DD MMM)') }}
      </template>
    </Column>
    <Column header="Action">
      <template #body="slotProps">
        <div v-if="slotProps.data.trackingType == 'Feed'">
          <div v-if="slotProps.data.endTimestamp == null">
            <Button label="Done" @click="finishFeeding(slotProps.data.timestamp)" />
          </div>
          <div v-if="slotProps.data.endTimestamp != null">
            {{
              Math.ceil(moment.duration((moment(slotProps.data.endTimestamp)).diff(moment(slotProps.data.timestamp))).asMinutes())
            }} min
          </div>
        </div>
      </template>
    </Column>
  </DataTable>
</template>
