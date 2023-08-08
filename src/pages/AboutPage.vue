<template>
  <!-- center q-page using tailwindcss -->
  <q-page class="mt-8">
    <div class="flex-row space-y-4">
      <CardComponent
        title="Who are we?"
        caption="We are a company that specializes in summarizing long speeches into short, digestible topics."
      />
      <CardComponent
        title="What are we hoping to achieve?"
        caption="We are hoping to make it easier for people to understand long speeches by summarizing them into short, digestible topics."
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CardComponent from 'components/CardComponent.vue';

export default defineComponent({
  name: 'AboutPage',
  components: { CardComponent },
});
</script>
