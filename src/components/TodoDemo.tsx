"use client"

import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'

interface TodoItem {
  id: string
  text: string
}

interface SortableItemProps {
  item: TodoItem
}

function SortableItem({ item }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-card border border-border rounded-md shadow-sm cursor-move hover:bg-accent transition-colors"
    >
      {item.text}
    </div>
  )
}

export default function TodoDemo() {
  const [items, setItems] = useState<TodoItem[]>([
    { id: '1', text: 'Learn Next.js' },
    { id: '2', text: 'Set up shadcn/ui' },
    { id: '3', text: 'Install @dnd-kit' },
    { id: '4', text: 'Build todo app' },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addItem = () => {
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: `New task ${items.length + 1}`,
    }
    setItems([...items, newItem])
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Todo App Demo</h1>
      <p className="text-muted-foreground text-center">
        Next.js + shadcn/ui + @dnd-kit working together
      </p>
      
      <Button onClick={addItem} className="w-full">
        Add New Task
      </Button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}