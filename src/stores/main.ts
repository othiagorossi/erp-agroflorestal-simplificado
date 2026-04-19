import { useSyncExternalStore } from 'react'

export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  crop: string
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
}

export interface Activity {
  id: string
  text: string
  date: string
}

interface State {
  tasks: Task[]
  crops: Crop[]
  activities: Activity[]
  metrics: { area: number; plants: number; carbon: number }
}

let state: State = {
  tasks: [
    { id: '1', title: 'Poda de Formação', status: 'todo', crop: 'Cacau', priority: 'Alta' },
    {
      id: '2',
      title: 'Colheita de Cachos',
      status: 'in-progress',
      crop: 'Banana',
      priority: 'Média',
    },
    { id: '3', title: 'Adubação Orgânica', status: 'done', crop: 'Palmito', priority: 'Baixa' },
    { id: '4', title: 'Plantio de Mudas', status: 'todo', crop: 'Ervas', priority: 'Média' },
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
    },
    {
      id: '2',
      name: 'Palmito',
      variety: 'Pupunha',
      ageProgress: 80,
      health: 'green',
      ratio: '30%',
      plot: 'Setor A',
    },
    {
      id: '3',
      name: 'Banana',
      variety: 'Prata',
      ageProgress: 95,
      health: 'yellow',
      ratio: '20%',
      plot: 'Setor B',
    },
    {
      id: '4',
      name: 'Ervas',
      variety: 'Alecrim',
      ageProgress: 30,
      health: 'green',
      ratio: '10%',
      plot: 'Setor C',
    },
    {
      id: '5',
      name: 'Cacau',
      variety: 'PS-1319',
      ageProgress: 40,
      health: 'green',
      ratio: '50%',
      plot: 'Setor B',
    },
  ],
  activities: [
    { id: '1', text: '50 mudas de Cacau plantadas no Setor A', date: 'Hoje, 08:30' },
    { id: '2', text: 'Colheita de Banana Prata finalizada', date: 'Ontem, 16:45' },
    { id: '3', text: 'Adubação realizada no Setor B', date: '15 Mai, 09:00' },
  ],
  metrics: { area: 120, plants: 15400, carbon: 450 },
}

const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const notify = () => listeners.forEach((l) => l())

export const storeActions = {
  addTask: (task: Omit<Task, 'id'>) => {
    state = { ...state, tasks: [...state.tasks, { ...task, id: Math.random().toString() }] }
    notify()
  },
  updateTaskStatus: (id: string, status: TaskStatus) => {
    state = { ...state, tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }
    notify()
  },
}

export default function useMainStore() {
  const currentState = useSyncExternalStore(subscribe, () => state)
  return {
    ...currentState,
    ...storeActions,
  }
}
