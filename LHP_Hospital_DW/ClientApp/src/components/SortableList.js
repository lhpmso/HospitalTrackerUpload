import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
    SortableContainer,
    SortableElement,
    SortableHandle
} from "react-sortable-hoc";
import arrayMove from "array-move";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DragHandleIcon from "@material-ui/icons/DragHandle";

const DragHandle = SortableHandle(() => (
    <ListItemIcon>
        <DragHandleIcon />
    </ListItemIcon>
));

const SortableItem = SortableElement(({ text }) => (
    <ListItem ContainerComponent="div" >
        <ListItemText primary={text} />
        <ListItemSecondaryAction>
            <DragHandle />
        </ListItemSecondaryAction>
    </ListItem>
));

const SortableListContainer = SortableContainer(({ items }) => (
    <List component="div" style={{width: "100%"}}>
        {items.map(({ id, text }, index) => (
            <SortableItem key={id} index={index} text={text} />
        ))}
    </List>
));

export const SortableList = ({setItems, items, style}) => {

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMove(items, oldIndex, newIndex));
    };

    return (
        <SortableListContainer
            
            items={items}
            onSortEnd={onSortEnd}
            useDragHandle={true}
            lockAxis="y"
            style={style}
        />
    );
};


