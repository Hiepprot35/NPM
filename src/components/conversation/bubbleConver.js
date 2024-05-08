import React from 'react';
import { useData } from '../../context/dataContext';
import WindowChat from '../message/windowchat';
import { FiEdit } from 'react-icons/fi';
export default function BubbleConver() {
  const { listHiddenBubble } = useData();

  return (
    <>
      {listHiddenBubble &&
        listHiddenBubble.map((e, i) => (
          <WindowChat
            key={i}
            count={e}
            isHidden={true}
            index={i}
          />
        ))}
          <div className="newMessage center">
        <span>
          <FiEdit></FiEdit>
        </span>
      </div>
    </>
  );
}
