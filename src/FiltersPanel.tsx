import {TextField, Grid, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FindIcon from '@material-ui/icons/Search';
import './index.css';

const useStyles = makeStyles({
    textFiled: {
        width: '100%',
      },
    searchButton:{
      width: '120px'
    },
  });

export default function MediaFilter({hundleSubmit}: any) {
    const classes = useStyles();
  
    return (
        <form noValidate onSubmit={hundleSubmit}> 
        <Grid container
              spacing={3}
              justify="center"
              alignItems="center">
            <Grid item lg={10} md={10} xs={12}>
                <TextField
                className={classes.textFiled}
                id="outlined-basic"
                label="Поиск...."
                variant="outlined"
                name="query"
                />
            </Grid>
            <Grid item lg={2} md={2} xs={12}>
            <Button
              variant="contained"
              color="primary"
              type='submit'
              startIcon={<FindIcon />}
            >
              Найти
            </Button>
            </Grid>
        </Grid>
        </form>
    );
}
