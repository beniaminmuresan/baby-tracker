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
