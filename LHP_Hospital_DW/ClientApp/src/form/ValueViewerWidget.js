import Grid from "@material-ui/core/Grid";
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import jp from "jsonpath"
import {bindActionCreators} from "redux";
import * as HealthPlanActions from "../actions/HealthPlanActions";

class ValueViewerWidget extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {
            id,
            required,
            readonly,
            disabled,
            label,
            onFocus,
            onBlur,
            onChange,
            options,
            autofocus,
            schema,
            query,
        } = this.props;
        const value = jp.query(this.props?.formContext, schema.query ? schema.query : '');
        return (
            <Grid container>
                <FormControl
                    fullWidth={true}
                    id={id}
                    disabled={disabled || readonly}
                >
                    <TextField value={value}
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               disabled={schema?.disabled || readonly}
                               autoFocus={autofocus}
                               required={required}
                               onClick={() => this.setState({open: true})}
                               label={label || schema.title}
                    />
                    <div style={{marginTop: 20}}>
                        {query}
                    </div>
                </FormControl>
            </Grid>

        )
    }

}

// ValueViewerWidget.propTypes = {
//     open: PropTypes.bool,
// };


function mapStateToProps(state) {
    return {
        //data: state.app.currentMemberForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(HealthPlanActions, dispatch),};
}

const ReduxWrapped = connect(mapStateToProps, mapDispatchToProps)(ValueViewerWidget);

export default (props) => {
    return (
        <ReduxWrapped {...props} />
    )
};