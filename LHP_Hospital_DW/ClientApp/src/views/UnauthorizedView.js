import Grid from '@material-ui/core/Grid';
import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";


export default class UnauthorizedView extends Component {
    render() {
        return (
            <Grid container alignContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h3">
                        You are not authorized to view this Page.
                    </Typography>
                    <Typography>
                        If you think this is an error or you would like to request access please contact your IT Department.
                    </Typography>
                </Grid>
            </Grid>
        )
    }
}
