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
        //CR: Лучше следить за значениями формы в этом компоненте, а не передавать событие onSubmit в другой компонент. Тем более форма может быть более сложной. У нее может быть валидация, и т.п..
        <form noValidate onSubmit={hundleSubmit}> 
        <Grid container
              spacing={3}
              justify="center"
              alignItems="center">
            <Grid item lg={10} md={10} xs={12}>
                {/*
                    CR:
                    Отслеживание состояния компонентов формы https://ru.reactjs.org/docs/forms.html#handling-multiple-inputs
                    Там есть пример, только надо переделать на хуки
                */}
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
