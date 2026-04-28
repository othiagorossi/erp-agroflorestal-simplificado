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
  tasks: [],
  crops: [],
  activities: [],
  metrics: { area: 0, plants: 0, carbon: 0, soilHealth: 0, waterUsage: 0 },
  soilData: [],
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
      (!state.soilData.length ||
        newMetrics.soilHealth !== state.soilData[state.soilData.length - 1].organic)
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
