import { FC, ReactNode, RefObject } from 'react';

interface ModalProps {
  dialogRef: RefObject<HTMLDialogElement>;
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const Modal: FC<ModalProps> = ({
  dialogRef,
  title,
  children,
  onClose
}) => {
  

  return (
    <dialog
      ref={dialogRef}
      className="p-6 rounded-lg shadow-xl backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[500px]"
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <header className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={() => dialogRef.current?.close()}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </header>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;

