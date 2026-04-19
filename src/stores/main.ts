import { useSyncExternalStore } from 'react'

export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  crop: string
  category: string
  area: string
  priority: 'Alta' | 'Média' | 'Baixa'
}

export interface Crop {
  id: string
  name: string
  variety: string
  ageProgress: number
  health: 'green' | 'yellow' | 'red'
  ratio: string
  plot: string
  growthStage: string
  plantingDate: string
}

export interface Activity {
  id: string
  text: string
  date: string
}

interface State {
  isAuthenticated: boolean
  tasks: Task[]
  crops: Crop[]
  activities: Activity[]
  metrics: { area: number; plants: number; carbon: number; soilHealth: number; waterUsage: number }
  soilData: { month: string; organic: number }[]
}

let state: State = {
  isAuthenticated: false,
  tasks: [
    {
      id: '1',
      title: 'Poda de Formação',
      status: 'todo',
      crop: 'Cacau',
      category: 'Poda',
      area: 'Setor A',
      priority: 'Alta',
    },
    {
      id: '2',
      title: 'Colheita de Cachos',
      status: 'in-progress',
      crop: 'Banana',
      category: 'Colheita',
      area: 'Setor B',
      priority: 'Média',
    },
    {
      id: '3',
      title: 'Adubação Orgânica',
      status: 'done',
      crop: 'Palmito',
      category: 'Adubação',
      area: 'Setor C',
      priority: 'Baixa',
    },
    {
      id: '4',
      title: 'Plantio de Mudas',
      status: 'todo',
      crop: 'Ervas',
      category: 'Plantio',
      area: 'Setor D',
      priority: 'Média',
    },
  ],
  crops: [
    {
      id: '1',
      name: 'Cacau',
      variety: 'CCN-51',
      ageProgress: 65,
      health: 'green',
      ratio: '40%',
      plot: 'Setor A',
      growthStage: 'Vegetativo',
      plantingDate: '2025-01-10',
    },
    {
      id: '2',
      name: 'Palmito',
      variety: 'Pupunha',
      ageProgress: 80,
      health: 'green',
      ratio: '30%',
      plot: 'Setor A',
      growthStage: 'Produtivo',
      plantingDate: '2024-06-15',
    },
    {
      id: '3',
      name: 'Banana',
      variety: 'Prata',
      ageProgress: 95,
      health: 'yellow',
      ratio: '20%',
      plot: 'Setor B',
      growthStage: 'Produtivo',
      plantingDate: '2024-03-20',
    },
    {
      id: '4',
      name: 'Ervas',
      variety: 'Alecrim',
      ageProgress: 30,
      health: 'green',
      ratio: '10%',
      plot: 'Setor C',
      growthStage: 'Muda',
      plantingDate: '2026-02-01',
    },
    {
      id: '5',
      name: 'Cacau',
      variety: 'PS-1319',
      ageProgress: 40,
      health: 'green',
      ratio: '50%',
      plot: 'Setor B',
      growthStage: 'Vegetativo',
      plantingDate: '2025-05-12',
    },
  ],
  activities: [
    { id: '1', text: '50 mudas de Cacau plantadas no Setor A', date: 'Hoje, 08:30' },
    { id: '2', text: 'Colheita de Banana Prata finalizada', date: 'Ontem, 16:45' },
    { id: '3', text: 'Adubação realizada no Setor B', date: '15 Mai, 09:00' },
  ],
  metrics: { area: 120, plants: 15400, carbon: 450, soilHealth: 4.9, waterUsage: 12500 },
  soilData: [
    { month: 'Jan', organic: 3.2 },
    { month: 'Mar', organic: 3.5 },
    { month: 'Mai', organic: 3.8 },
    { month: 'Jul', organic: 4.1 },
    { month: 'Set', organic: 4.5 },
    { month: 'Nov', organic: 4.9 },
  ],
}

const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const notify = () => listeners.forEach((l) => l())

export const storeActions = {
  login: () => {
    state = { ...state, isAuthenticated: true }
    notify()
  },
  logout: () => {
    state = { ...state, isAuthenticated: false }
    notify()
  },
  addTask: (task: Omit<Task, 'id'>) => {
    state = { ...state, tasks: [...state.tasks, { ...task, id: Math.random().toString() }] }
    notify()
  },
  updateTaskStatus: (id: string, status: TaskStatus) => {
    state = { ...state, tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }
    notify()
  },
  addCrop: (crop: Omit<Crop, 'id'>) => {
    state = { ...state, crops: [...state.crops, { ...crop, id: Math.random().toString() }] }
    notify()
  },
  updateMetrics: (newMetrics: Partial<State['metrics']>) => {
    state = { ...state, metrics: { ...state.metrics, ...newMetrics } }
    if (
      newMetrics.soilHealth &&
      newMetrics.soilHealth !== state.soilData[state.soilData.length - 1].organic
    ) {
      state.soilData = [...state.soilData, { month: 'Atual', organic: newMetrics.soilHealth }]
    }
    notify()
  },
}

export default function useMainStore() {
  const currentState = useSyncExternalStore(subscribe, () => state)
  return { ...currentState, ...storeActions }
}
