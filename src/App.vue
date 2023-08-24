<script setup>
  import { reactive, watch, ref } from 'vue';
  import Button from 'primevue/button';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import SelectButton from 'primevue/selectbutton';
  import moment from 'moment';

  const trackingData = ref(JSON.parse(localStorage.getItem('trackingData')) || []);
  const markPoo = () => {
    trackingData.value.push({ trackingType: 'Poo', timestamp: Date.now() });
  }
  const markPee = () => {
    trackingData.value.push({ trackingType: 'Pee',  timestamp: Date.now() });
  }
  const markStartFeeding = () => {
    trackingData.value.push({ trackingType: 'Feed', timestamp: Date.now(), endTimestamp: null });
  }
  const finishFeeding = (timestamp) => {
    const trackingIndex = trackingData.value.findIndex(key => key.timestamp == timestamp);
    trackingData.value[trackingIndex].endTimestamp = Date.now();
  }
  const deleteTrackingItem = (timestamp) => {
    trackingData.value = trackingData.value.filter(key => key.timestamp != timestamp);
  }
  const feedSideOptions = ref(['L', 'R']);

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
            <SelectButton v-model="slotProps.data.feedSide" :options="feedSideOptions" aria-labelledby="basic" severity="help" />
            <Button label="Finish" @click="finishFeeding(slotProps.data.timestamp)" />
          </div>
          <div v-if="slotProps.data.endTimestamp != null">
            {{
              Math.ceil(moment.duration((moment(slotProps.data.endTimestamp)).diff(moment(slotProps.data.timestamp))).asMinutes())
            }} min  {{ (slotProps.data.feedSide != null) ?  `- ${slotProps.data.feedSide}` : '' }}
          </div>
        </div>
        <Button label="X" severity="danger" @click="deleteTrackingItem(slotProps.data.timestamp)" />
      </template>
    </Column>
  </DataTable>
</template>
