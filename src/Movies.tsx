import {Box, Container, Grid, Typography, CircularProgress, Button} from '@material-ui/core';
import {useState, useEffect} from 'react';
import './index.css';
import FindPanel from './FiltersPanel';
import Card from './Сard';
import axios from 'axios';
import noPoster from './no-poster.jpg'

const api_key: String = '5bdb545224b8012b6ddfc5c1c9406f02'

export default function MediaMain() {
  const cardsOnPage = 20;
  const [cards, setCards] = useState([]);
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1) //максимальное количество страниц

  useEffect(()=>{
    query ? getCardsApi('search', {query : query, page : page})
          : getCardsApi('discover', {
            page : page,
            sort_by : 'popularity.desc',
            include_video : false,
            with_watch_monetization_types : 'flatrate'
          })
  })

  function getCardsApi(action : String, data: object){
    axios.get(`https://api.themoviedb.org/3/${action}/movie?`,{
      params: Object.assign({
        api_key : api_key,
        language : 'ru-RUS',
        include_adult : false
      }, data)
    })
      .then(res => {
        setCards(page>1 ? (prevCards) => [...prevCards.slice(0, ((page-1)*cardsOnPage)), ...res.data.results]
                        : res.data.results);
        setTotalPages(res.data.total_pages)
      })
      .then(()=> setLoading(false))
  }
 
  function hundleSubmit(event: any){
    setLoading(true)
    event.preventDefault();
    setQuery(event.target[0].value);
    setPage(1)
  };

  //Зависает, если пробую реализовать бесконечный скролл
  const onScroll = () => {
    if (loading) return
    const windowHeight = window.innerHeight
    const documentHeight = document.body.clientHeight
    const scrollTop = window.pageYOffset
    if ((windowHeight + scrollTop >= documentHeight) && (page < totalPages)) {
      setLoading(true)
      setPage(prevPage => prevPage+1)
    }
  }

  
  //window.addEventListener('scroll', onScroll)

  function createCard(){
    const imageUrl = "https://image.tmdb.org/t/p/w300/";
    if (!cards[0] && query) return <Typography gutterBottom variant="h5">Поиск по запросу: "<b>{query}</b>" не дал результатов.</Typography>
    return (
      cards.map((item: any) => 
      <Grid item lg={4} md={6} xs={12}>
        <Card movieName={item.title} date={item.release_date} image={item.poster_path ? imageUrl+item.poster_path : noPoster} overview={item.overview || 'Описание отсутствует'}/>
      </Grid>
    ))
  }

  function onnloadMore(){
    setPage(page+1)
    setLoading(true)
  }

  return (
    <Container maxWidth={'lg'}>  
    <Box m={2}>
      <FindPanel hundleSubmit={hundleSubmit}/>
    </Box>
    <Box m={2}>
        <Grid container spacing={3} style={{textAlign: 'center'}} justify='center' alignItems='center'>
            {createCard()}
            {loading ? <Grid item lg={12} md={12} xs={12}><CircularProgress/></Grid>: ''}
        </Grid>
        {page < totalPages ? <Button className='onloadMore' onClick={onnloadMore} variant="outlined" size="medium" color="primary"> Загрузить еще </Button> : ''}
    </Box>
    </Container>
  );
}
