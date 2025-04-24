import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import FormsComponent from './FormsComponent';
import { FormElement } from '../types/form';
import { MdDelete } from "react-icons/md";
interface DraggableFormElementProps {
  element: FormElement;
  index: number;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
  onChange: (value: string) => void;
  onDelete: () => void;
  value?: string;
  error?: string;
}

const ItemTypes = {
  FORM_ELEMENT: 'form_element'
};

export const DraggableFormElement = ({
  element,
  index,
  moveElement,
  onChange,
  onDelete,
  value,
  error
}: DraggableFormElementProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.FORM_ELEMENT,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveElement(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FORM_ELEMENT,
    item: () => ({ id: element.name, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`mb-4 bg-white p-4 rounded-md border-[1px] border-gray-300 cursor-move transition-all ${
        isDragging ? 'shadow-lg scale-[1.02]' : ''
      }`}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 cursor-move select-none">⋮⋮</span>
          <label className="font-medium">
            {element.label}{" "}
            {element?.required && <span className="text-red-500">*</span>}{" "}
          </label>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 cursor-pointer"
        >
         <MdDelete/>
        </button>
      </div>
      <FormsComponent
        {...element}
        onChange={onChange}
        value={value}
        error={error}
      />
    </div>
  );
};

export default DraggableFormElement; 