<!-- pages/ConsultaIbge.vue -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md q-mx-auto" style="max-width: 500px">
      <q-card-section>
        <div class="text-h6">Consulta de Cidades (IBGE)</div>
      </q-card-section>

      <q-form class="q-gutter-md" @submit.prevent="confirmar">
        <q-select
          v-model="estadoSelecionado"
          :options="estados"
          option-value="sigla"
          option-label="nome"
          label="Selecione um Estado"
          emit-value
          map-options
          :loading="loadingEstados"
          :disable="loadingEstados"
        />

        <q-select
          v-model="cidadeSelecionada"
          :options="cidades"
          label="Selecione uma Cidade"
          use-input
          fill-input
          input-debounce="300"
          :loading="loadingCidades"
          :disable="!estadoSelecionado || loadingCidades"
        />

        <q-btn
          type="submit"
          label="Confirmar"
          color="primary"
          :disable="!cidadeSelecionada"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

const estados = ref([])
const cidades = ref([])
const estadoSelecionado = ref(null)
const cidadeSelecionada = ref(null)

const loadingEstados = ref(false)
const loadingCidades = ref(false)

const carregarEstados = async () => {
  loadingEstados.value = true
  try {
    const { data } = await api.get('/ibge/uf/v1')
    estados.value = data.sort((a, b) => a.nome.localeCompare(b.nome))
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar estados: ' + e })
  } finally {
    loadingEstados.value = false
  }
}

const carregarCidades = async () => {
  if (!estadoSelecionado.value) return

  loadingCidades.value = true
  cidadeSelecionada.value = null
  cidades.value = []

  try {
    const { data } = await api.get(`/ibge/municipios/v1/${estadoSelecionado.value}?providers=dados-abertos-br,gov,wikipedia`)
    cidades.value = data.map(c => c.nome).sort()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar cidades: ' + e })
  } finally {
    loadingCidades.value = false
  }
}

const confirmar = () => {
  $q.notify({
    type: 'positive',
    message: `Você selecionou: ${cidadeSelecionada.value} - ${estadoSelecionado.value}`
  })
}

watch(estadoSelecionado, carregarCidades)
onMounted(carregarEstados)
</script>
