<!-- NumberInput.vue -->

<template>
    <ion-input 
        type="number" 
        v-model="formattedValue"
        @ionInput="handleInput($event.target.value)"
    />
</template>

<script>
import { ref, defineComponent } from 'vue';

export default defineComponent({
    props: {
        value: {
            type: Number,
            default: 0
        },
    },
    setup(props) {
        const formattedValue = ref(props.value);

        function handleInput(value) {
            if (value.startsWith('0') && value.length > 1) {
                value = value.slice(1);
            }
            value = value.replace(/[^0-9.]/g, '');
            if (value === '') {
                value = '0';
            }
            formattedValue.value = +value;
        }

        return {
            formattedValue,
            handleInput,
        }
    }
});
</script>