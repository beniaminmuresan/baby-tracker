<script setup>
  import { reactive, watch, ref } from 'vue';
  import Button from 'primevue/button';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import SelectButton from 'primevue/selectbutton';
  import moment from 'moment';
  import html2pdf from "html2pdf.js";

  let trackingData = reactive(JSON.parse(localStorage.getItem('trackingData')) || []);
  const markPoo = () => {
    trackingData.push({ trackingType: 'Poo', timestamp: Date.now() });
  }
  const markPee = () => {
    trackingData.push({ trackingType: 'Pee',  timestamp: Date.now() });
  }
  const markStartFeeding = () => {
    if (trackingData.findIndex(key => key.trackingType == "Feed" && key.endTimestamp == null) == -1)
      trackingData.push({ trackingType: 'Feed', timestamp: Date.now(), endTimestamp: null });
  }
  const finishFeeding = (timestamp) => {
    const trackingIndex = trackingData.findIndex(key => key.timestamp == timestamp);
    trackingData[trackingIndex].endTimestamp = Date.now();
  }
  const deleteTrackingItem = (timestamp) => {
    const index = trackingData.findIndex(key => key.timestamp == timestamp);
    trackingData.splice(index, 1);
  }
  const feedSideOptions = ref(['L', 'R']);

  watch(trackingData, (newtrackingData) => {
    localStorage.setItem('trackingData', JSON.stringify(newtrackingData));
  })

  const exportToPdf = () => {
    html2pdf(document.getElementById("export-data"), {
      margin: 1,
      filename: "tracking.pdf",
    });
  }
</script>

<template>
  <div class="card flex justify-content-center flex-wrap gap-5">
    <Button label="Poo" severity="danger" @click="markPoo" />
    <Button label="Pee" severity="warning" @click="markPee" />
    <Button label="Eat" @click="markStartFeeding" />
  </div>

  <br>
  <div id="export-data">
    <DataTable :value="trackingData" sortField="timestamp" :sortOrder="-1">
      <Column header="Tip">
        <template #body="slotProps">
          <div class="card flex justify-content-start flex-wrap gap-3">
            <img alt="etc" :src="`${slotProps.data.trackingType}.png`" style="height: 50px;"/>
            <div v-if="slotProps.data.trackingType == 'Feed' && slotProps.data.endTimestamp == null">
              <SelectButton v-model="slotProps.data.feedSide" :options="feedSideOptions" aria-labelledby="basic" severity="help" />
            </div>
            <div v-if="slotProps.data.trackingType == 'Feed' && slotProps.data.endTimestamp != null">
              {{
                Math.ceil(moment.duration((moment(slotProps.data.endTimestamp)).diff(moment(slotProps.data.timestamp))).asMinutes())
              }} min  {{ (slotProps.data.feedSide != null) ?  `- ${slotProps.data.feedSide}` : '' }}
            </div>
          </div>
        </template>
      </Column>
      <Column header="Time">
        <template #body="slotProps">
          {{ moment(slotProps.data.timestamp).format('HH:mm (DD MMM)') }}
        </template>
      </Column>
      <Column header="">
        <template #body="slotProps">
          <div class="card flex justify-content-end flex-wrap gap-3">
            <div v-if="slotProps.data.trackingType == 'Feed'">
              <div v-if="slotProps.data.endTimestamp == null">
                <Button label="Finish" @click="finishFeeding(slotProps.data.timestamp)" />
              </div>
            </div>
            <Button label="X" severity="danger" @click="deleteTrackingItem(slotProps.data.timestamp)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <br>
  <div class="card flex justify-content-center flex-wrap gap-5">
    <Button label="Export PDF" @click="exportToPdf" />
  </div>
</template>
