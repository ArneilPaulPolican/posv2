<!-- InputFloat.vue -->
<template>
    <ion-input v-model="float_value" type="number" placeholder="0.00" @ionInput="trimmValue" style="text-align: end;"></ion-input>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';

export default defineComponent({
    props: {
        amount: {
            type: Number,
            default: 0
        },
    },
    setup(props,{emit}){
        const { amount } = toRefs(props);
        const float_value = ref(amount)
        const trimmValue = (event: any) =>{
            const inputValue = event.target.value;
            const floatValue = parseFloat(inputValue.replace(/[^\d\.]/g, '')); 
            float_value.value = floatValue;
            emit('update', floatValue);
        }
        
        return{
            float_value,
            trimmValue
        }
    }
})
</script>