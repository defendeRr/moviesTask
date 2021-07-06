 // CR: Button не используется. warning в консоли
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
  }, [query, page])
   // CR: Исправить warning в консоли. Нужно добавить getCardsApi в массив зависимостей

  // CR: функцию getCardsApi обернуть в React.useCallback
  function getCardsApi(action : String, data: object){
    axios.get(`https://api.themoviedb.org/3/${action}/movie?`,{
      // CR: Вместо Object.assign лучше использовать Spread syntax { ke1: value1, key2: value2, ...data } Просто запись получается короче
      params: Object.assign({
        // CR: Когда имя ключа совпадает с именем переменной из которой берется значение, можно использовать короткую запись, просто {..., api_key, ... }
        api_key : api_key,
        language : 'ru-RUS',
        include_adult : false
      }, data)
    })
      .then(res => {
        // CR: Обычно стараемся не оставлять console.log в коде вообще. Используем только для отладки.
        console.log('юсэффект')
        // CR: По-моему slice здесь лишний
        setCards(page>1 ? (prevCards) => [...prevCards.slice(0, ((page-1)*cardsOnPage)), ...res.data.results]
                        : res.data.results);
        setTotalPages(res.data.total_pages)
      })
      .then(()=> setLoading(false))
      // CR: Хорошо бы добавить блок catch для обработки ошибок
      // CR: можно переписать на async/await. Часто с их помощью код получается чище. особенно когда несколько связанных асинхронных операций. Но в данном случае так тоже хорошо. Я сам пока так пишу погда всего один запрос.
  }
 
  // CR: Лучше чтобы сюда уже приходило не само событие а просто строка query. По идее компонент Movies не долен знать о логике компонента FindPanel
  function hundleSubmit(event: any){
    // CR: Лучше перенести это в самое начало метода getCardsApi. А одном месте проще следить за состоянием загрузки. Сейчас лоадер показывается не во всех ситуациях.
    setLoading(true)
    event.preventDefault();
    /*
    CR:
    1. Чтобы понять что здесь происходит, приходится заглядывать в код другого компонента.
    2. Если там что-то поменяется, про это место можно забыть, тогда здесь может возникнуть ошибка.
    3. Панель поиска может быть сложнее и состоять еще из каких-нибудь фильтров. Тогда код здесь будет совсем не читаемым.
    */
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

  // CR: Сейчас при каждом рендеринге создается новый слушатель. Нужно добавлять слушателя только один раз.
  window.addEventListener('scroll', onScroll)

  function createCard(){
    const imageUrl = "https://image.tmdb.org/t/p/w300/";
    if (!cards[0] && query) return <Typography gutterBottom variant="h5">Поиск по запросу: "<b>{query}</b>" не дал результатов.</Typography>
    return (
      /*
        CR: 
        Я тоже так делаю когда мне лень или времени не хватает. Но на ум сразу приходит анекдот:
        - А ты правда пишешь на TypeScript?
        - Да
        - Скажи что-нибудь по тайпскриптовому!
        - as any
      */
      cards.map((item: any) =>
      // CR: В консоли браузера Warning: Each child in a list should have a unique "key" prop.
      <Grid item lg={4} md={6} xs={12}>
        <Card movieName={item.title} date={item.release_date} image={item.poster_path ? imageUrl+item.poster_path : noPoster} overview={item.overview || 'Описание отсутствует'}/>
      </Grid>
    ))
  }

  // CR: Warnin в консоли. Лучше не оставлять не используемый код
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
        {/* {page < totalPages ? <Button className='onloadMore' onClick={onnloadMore} variant="outlined" size="medium" color="primary"> Загрузить еще </Button> : ''} */}
    </Box>
    </Container>
  );
}
