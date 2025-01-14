import React, { useEffect, useRef, useState } from "react";
import Upload from "../imageView/Upload";
import { Popover } from "antd";
import { FiImage, FiList, FiPlusCircle } from "react-icons/fi";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Item from "antd/es/list/Item";
import debounce from "lodash.debounce";
import { v4 as uuidv4 } from "uuid";
import ColumnBlog from "./ColumnBlog";

export default function CreateBlog() {
  document.title='Create Blog'
  const handleSetImage = (e, cols, item) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      updateColsFunction({col:cols.id,id:item.id,content:url,type:2})
    }
  };
  const handleInputChange = (colIndex, type) => {
    // const newContent = e.target.innerText;

    const newCols = Cols.map((data) => {
      if (data.id === colIndex) {
        return {
          ...data,
          items: [
            ...data.items,
            { content: "", type: type, id: uuidv4(), hidden: true },
          ],
        };
      }
      return data;
    });
    // setIsInputText(false);
    setCols(newCols);
  };

  const [Cols, setCols] = useState([
    { id:  uuidv4(), items: [{ type: 1, content: "", id: uuidv4() }] },
  ]);

  const handleDragEnd = (e) => {
    const { destination, source, draggableId } = e;
    try {
      // Nếu không có vị trí đích (kéo ra ngoài vùng droppable)
      if (!destination) {
        setCols((prevCols) => [
          ...prevCols,
          { id:  uuidv4(), items: [{ type: 1, content: "", id: uuidv4() }] },
        ]);
        return;
      }

      // Nếu không có sự thay đổi vị trí
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const startCol = Cols.find(
        (col) => col.id === source.droppableId
      );
      const finishCol = Cols.find(
        (col) => col.id === destination.droppableId
      );
      if (!startCol || !finishCol) return;
      if (startCol === finishCol) {
        const newItems = [...startCol.items];
        const [movedItem] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, movedItem);
        const updatedCols = Cols.map((col) => {
          if (col.id === startCol.id) {
            return { ...col, items: newItems };
          }
          return col;
        });

        setCols(updatedCols);
        return;
      }
      const startItems = [...startCol.items];
      const finishItems = [...finishCol.items];
      const [movedItem] = startItems.splice(source.index, 1);
      finishItems.splice(destination.index, 0, movedItem);
      const updatedCols = Cols.map((col) => {
        if (col.id === startCol.id) {
          return { ...col, items: startItems };
        }
        if (col.id === finishCol.id) {
          return { ...col, items: finishItems };
        }
        return col; // Các cột khác giữ nguyên
      });

      setCols(updatedCols);
    } catch (error) {}
  };

  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const updateColsFunction=(updateItem)=>
    {
      const updatedCols = Cols.map((col) => {
        if (col.id === updateItem.col) {
          // Nếu đúng cột, cập nhật items
          const updatedItems = col.items.map((item) =>
            item.id === updateItem.id
              ? { ...item, ...updateItem } // Cập nhật nội dung mới
              : item
          );
          return { ...col, items: updatedItems }; // Trả về col với items đã được cập nhật
        }
        return col; // Các col khác giữ nguyên
      });
    
      setCols(updatedCols)
    }
  const InputText2 = ({
    onBlur,
    placeholder,
    provided,
    id,
    hidden,
    col,
    snapshot,
    index,
  }) => {
    return (
      <div
        className="flex z-10 w-full "
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <div
          className={`flex items-center px-4 ${
            snapshot.isDragging ? `after:content-['${placeholder}']` : ""
          }`}
        >
          <Popover
            trigger={"click"}
            content={
              <div>
                <ul>
                  <li onClick={()=>updateColsFunction({col:col.id,id:id,content:'',type:2})} className="p-4">
                    Change to img
                  </li>
                  <li className="p-4">Change to text</li>
                </ul>
              </div>
            }
          >
            <FiList></FiList>
          </Popover>
        </div>
        <div className={`w-full flex focus:outline-none py-4 hover:cursor-text	`}>
          <div
            ref={index === col.items.length - 1 ? lastItemRef : null}
            className="w-full"
            onBlur={(e) => updateColsFunction({col:col.id,id:id,content:e.target.innerText,type:1})}
            contentEditable
            suppressContentEditableWarning={true}
            placeholder="Text"
          >
            {placeholder}
          </div>
        </div>
      </div>
    );
  };

  const InputImg = ({ item, col }) => {
    return (
      <div class="flex items-center justify-center w-full">
        <label
          for={item.id}
          class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <FiImage size={20} className="m-4"></FiImage>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id={item.id}
            onChange={(e) => handleSetImage(e, col, item)}
            type="file"
            class="hidden"
          />
        </label>
      </div>
    );
  };
  const handleAddColumnElement = (index) => {
    const newCols = Cols.map((col) =>
      col.id === index
        ? { ...col, items: [...col.items] } // Tạo bản sao sâu cho `items`
        : col
    );
    const colsIndex = newCols.find((e) => e.id === index);
    if (colsIndex.items.length === 0) {
      handleInputChange(index, 1);
    } else if (
      colsIndex.items[colsIndex.items.length - 1].content.length > 0 &&
      colsIndex.items.length >= 1
    ) {
      handleInputChange(index, 1);
    } else if (
      colsIndex.items.length >= 2 &&
      colsIndex.items[colsIndex.items.length - 2].content.length === 0 &&
      colsIndex.items[colsIndex.items.length - 1].content.length === 0
    ) {
      colsIndex.items.splice(colsIndex.items.length - 1, 1);
      setCols(newCols);
    } else {
      if (lastItemRef.current) {
        lastItemRef.current.focus();
      }
    }
  };
  const lastItemRef = useRef(null);
  const BORDER_SIZE = 4;
  const panelRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  // Khi thêm hoặc cập nhật phần tử
  const handleMouseDown = (e) => {
    if (e.nativeEvent.offsetX < BORDER_SIZE) {
      setIsResizing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isResizing || !panelRef.current) return;
    const panel = panelRef.current;
    const dx = panel.dataset.mPos - e.clientX;
    panel.dataset.mPos = e.clientX;
    panel.style.width = `${parseInt(getComputedStyle(panel).width) + dx}px`;
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="content">
          <div>CreateBlog</div>

          <div className="w-full flex flex-col items-center	">
            <div className="w-3/4 ">
              <textarea
                placeholder="Title"
                className=" px-4 text-5xl py-2 placeholder:text-5xl  border-none focus:outline-none bg-transparent dark:text-gray-200 resize-none"
              />
            </div>

            <div className="flex min-h-75vh h-75vh w-70vw ">
              {Cols.map((col,index) => (
               <ColumnBlog Cols={Cols} setCols={setCols} col={col}></ColumnBlog>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>
    </>
  );
}
