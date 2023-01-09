import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';



export default function ModalComponent({open, bodyText, positiveFn, negativeFn, closeFn, negativeTitle, positiveTitle}) {



    const body = (
        <div>
            <h2 id="simple-modal-title">Text in a modal</h2>
            <p id="simple-modal-description">
                {bodyText}
            </p>
        </div>
    );

    return (
        <Modal open={open}
               onClose={closeFn}
               >
            {body}
            {negativeFn ? <Button onClick={negativeFn}>{negativeTitle ? negativeTitle : "No"}</Button> : null}
            {positiveFn ? <Button onClick={positiveFn}>{positiveTitle ? positiveTitle : "Yes"}</Button> : null}
        </Modal>
    )

}