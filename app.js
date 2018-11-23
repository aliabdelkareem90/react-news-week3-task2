import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

let searchTerm ;

let SearchBox = styled.input `
  border-radius: 20px;
  background-color: #eee;
  color: #555;
  font-size: 1.2rem;
  border: 0px;
  height: 40px;
  outline: none;
  padding: 0 15px;
`
let Navigation = styled.header `
  display: flex;
  padding: 0px 10%;
  align-items: center;
  background-color: #fff;
  justify-content: space-between;
  box-shadow: 0px 2px 25px rgba(0,0,0,0.16);
  height: 100px;
`

let NewsContainer = styled.main`
  background-color: #eee;
  padding: 0px 10%;

`

let NewsItem = styled.div`
  background-color: #fff;
  border: 2px solid #E5E9F2;
  min-height: 120px;
  margin: 10px 0px;
  border-radius: 4px;
  display: flex;
  padding: 10px;
`

let NewsText = styled.div`
  padding-left: 14px;
  position: relative;
  marign-right:10px;
  flex-grow: 1;
`

let DateTime = styled.time`
  position: absolute;
  bottom: auto;
  margin-top: 20px;
  color: #399DF2;
  font-family: sans-serif;
  font-size: 14px;
`

let VoteDiv = styled.div`
  font-size: 19px;
  margin: auto;
  text-align: -webkit-center;
`

let DropdownArea = styled.div`
  min-height: 50px;
  height:auto;
  width: 80%;
  margin: auto;
  margin-top: 20px
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

class News extends Component{
  
  constructor(){
    super()
  
    this.state = {
      news: [],
      searchValue: '',
      voteCount: []
    }

    this.getNews()

  }

  getNews(searchQuery = 'Iraq') {
    fetch(`https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=978d6c3818ff431b8c210ae86550fb1f`)
    .then((response)=>{
      return response.json()
    })
    .then((data)=>{
      this.setState({
        news: data.articles
      })
    })
    //  localStorage.clear()
    searchTerm = searchQuery
    for (let i = 0; i < localStorage.length; i++) {
      localStorage.getItem(searchTerm+i)
    }
  }

  onInputChange(event){
    this.setState({
      searchValue: event.target.value
    })
    
  } 

  onKeyUp(event){
    if(event.key == 'Enter'){
      this.getNews(this.state.searchValue)
      this.setState({
        searchValue: ''
      })
    }
  }

  onVote(className, i) {
    let voteCount = this.state.voteCount.slice()
    if (className === 'up') {
      if (voteCount[i] === undefined) {
        voteCount[i] = 0
      }
      voteCount[i] += 1
    } else if (className === 'down') {
      if (voteCount[i] === undefined) {
        voteCount[i] = 0
      }
      if(voteCount[i] > 0) {
        voteCount[i] -= 1
      }
    }
    localStorage.setItem(searchTerm+i, voteCount[i])
    console.log(localStorage)
    this.setState({
      voteCount: voteCount
    })   
  }

  render() {
    return (
      <React.Fragment>
        <Navigation>
          <img width="150px;" src={require('./assets/logo.svg')}/>
          <SearchBox 
          onChange={this.onInputChange.bind(this)} 
          onKeyUp={this.onKeyUp.bind(this)}
          value={this.state.searchValue} placeholder="search term"/>
        </Navigation>
        <DropdownArea>
          Sorted By
          <select >
            <option value="no" >No filter</option>
            <option value="title" >Title</option>
            <option value="date">Date</option>
            <option value="most">Most voted</option>
          </select>

          Show Articles
          <select>
            <option value="all">All</option>
            <option value="five">First five</option>
            <option value="ten">First ten</option>
            <option value="fifteen">First fifteen</option>
          </select>
        </DropdownArea>
        <NewsContainer>
          {
            this.state.news.map((item, i)=>{
              return (
              <NewsItem key={i}>
                  <img width="124px;" height="124px" src={item.urlToImage} />
                <NewsText>
                  <h2>{item.title}</h2>
                  <p className="news-text">{item.description}</p>
                  <DateTime>{item.publishedAt}</DateTime>
                </NewsText>
                <VoteDiv key={i}>
                  <img className="vote-img" src={require('./assets/upvote.svg')} onClick={this.onVote.bind(this, "up", i)}/>
                  {localStorage.getItem(searchTerm+i) == undefined ? 0 : localStorage.getItem(searchTerm+i)}
                  <img className="vote-img" src={require('./assets/downvote.svg')} onClick={this.onVote.bind(this, "down", i)}/>
                </VoteDiv>
              </NewsItem>
              )
            })
          }
        </NewsContainer>
      </React.Fragment>
    )
  }
}

function App() {
  return <div>
    <News/>
  </div>
}

ReactDOM.render(<App/>, document.getElementById('root'))