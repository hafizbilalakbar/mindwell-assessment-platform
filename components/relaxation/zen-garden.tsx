"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, Trash2, Save, RotateCcw } from "lucide-react"

interface ZenElement {
  id: string
  type: "stone" | "plant" | "sand"
  x: number
  y: number
  rotation: number
  size: number
}

export function ZenGarden() {
  const [elements, setElements] = useState<ZenElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [elementType, setElementType] = useState<"stone" | "plant" | "sand">("stone")
  const [elementSize, setElementSize] = useState(40)
  const gardenRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Load saved garden from localStorage
  useEffect(() => {
    const savedGarden = localStorage.getItem("mindwell_zen_garden")
    if (savedGarden) {
      try {
        setElements(JSON.parse(savedGarden))
      } catch (error) {
        console.error("Error loading saved garden:", error)
      }
    }
  }, [])

  const addElement = (e: React.MouseEvent) => {
    if (!gardenRef.current) return
    
    const rect = gardenRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Only add if clicking directly on the garden (not on an existing element)
    if (e.target === gardenRef.current) {
      const newElement: ZenElement = {
        id: `element-${Date.now()}`,
        type: elementType,
        x,
        y,
        rotation: Math.random() * 360,
        size: elementSize
      }
      
      setElements(prev => [...prev, newElement])
    }
  }
  
  const startDragging = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelectedElement(id)
    setIsDragging(true)
    
    const element = elements.find(el => el.id === id)
    if (element) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElement && gardenRef.current) {
      e.preventDefault()
      
      const rect = gardenRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - dragOffset.x
      const y = e.clientY - rect.top - dragOffset.y
      
      setElements(prev => 
        prev.map(el => 
          el.id === selectedElement 
            ? { ...el, x, y } 
            : el
        )
      )
    }
  }
  
  const stopDragging = () => {
    setIsDragging(false)
    setSelectedElement(null)
  }
  
  const rotateElement = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setElements(prev => 
      prev.map(el => 
        el.id === id 
          ? { ...el, rotation: el.rotation + 45 } 
          : el
      )
    )
  }
  
  const removeElement = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setElements(prev => prev.filter(el => el.id !== id))
  }
  
  const clearGarden = () => {
    setElements([])
  }
  
  const saveGarden = () => {
    localStorage.setItem("mindwell_zen_garden", JSON.stringify(elements))
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant={elementType === "stone" ? "default" : "outline"} 
            size="sm"
            onClick={() => setElementType("stone")}
          >
            Stones
          </Button>
          <Button 
            variant={elementType === "plant" ? "default" : "outline"} 
            size="sm"
            onClick={() => setElementType("plant")}
          >
            <Leaf className="h-4 w-4 mr-1" />
            Plants
          </Button>
          <Button 
            variant={elementType === "sand" ? "default" : "outline"} 
            size="sm"
            onClick={() => setElementType("sand")}
          >
            Sand
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearGarden}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={saveGarden}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="mb-3 text-sm text-gray-500">
        Click in the garden to place elements. Drag to move them.
      </div>
      
      <div 
        ref={gardenRef}
        className="w-full h-[300px] bg-amber-50 rounded-lg overflow-hidden relative border border-amber-100 cursor-pointer"
        onClick={addElement}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        {elements.map(element => (
          <div
            key={element.id}
            className={`absolute cursor-move ${
              element.type === 'stone' ? 'bg-gray-600 rounded-full' : 
              element.type === 'plant' ? 'text-green-600' :
              'bg-amber-200 rounded-full'
            }`}
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              transform: `rotate(${element.rotation}deg)`,
              zIndex: selectedElement === element.id ? 10 : 1
            }}
            onMouseDown={(e) => startDragging(e, element.id)}
            onDoubleClick={(e) => rotateElement(e, element.id)}
            onClick={(e) => e.stopPropagation()}
          >
            {element.type === 'plant' && (
              <Leaf 
                className="w-full h-full" 
                style={{ transform: `rotate(${element.rotation}deg)` }}
              />
            )}
            <button 
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
              onClick={(e) => removeElement(e, element.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <label className="block text-sm text-gray-500 mb-2">Element Size</label>
        <input 
          type="range" 
          min="20" 
          max="80" 
          value={elementSize}
          onChange={(e) => setElementSize(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
} 