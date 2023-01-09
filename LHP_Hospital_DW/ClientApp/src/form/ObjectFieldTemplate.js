import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    root: {
        marginTop: 10,
    },
});

const ObjectFieldTemplate = (props) => {
    const {
        DescriptionField,
        description,
        TitleField,
        title,
        properties,
        required,
        uiSchema,
        idSchema,
    } = props;
    
    const classes = useStyles();
    console.log(properties);
    return (
        <>
            {(uiSchema['ui:title'] || title) && (
                <TitleField
                    id={`${idSchema.$id}-title`}
                    title={title}
                    required={required}
                />
            )}
            {description && (
                <DescriptionField
                    id={`${idSchema.$id}-description`}
                    description={description}
                />
            )}
            <Grid container={true} spacing={2} className={classes.root}>
                {/*{properties.map((element, index) => (*/}
                {/*    <Grid*/}
                {/*        item={true}*/}
                {/*        xs={12}*/}
                {/*        key={index}*/}
                {/*        style={{marginBottom: '10px'}}*/}
                {/*    >*/}
                {/*        {element.content}*/}
                {/*    </Grid>*/}
                {/*))}*/}
            </Grid>
        </>
    );
};

export default ObjectFieldTemplate;