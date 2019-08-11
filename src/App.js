import React from 'react';
import './App.css';

class Button extends React.Component{
  render(){
    let symbol
    switch(this.props.symbol){
      case '/': symbol = 'divide'; break;
      case 'x': symbol = 'multiply'; break;
      case '+': symbol = 'add'; break;
      case '-': symbol = 'subtract'; break;
      case '.': symbol = 'decimal'; break;
      case '=': symbol = 'equals'; break; 
      case 'AC': symbol = 'clear'; break; 
      case 1: symbol = 'one'; break;
      case 2: symbol = 'two'; break;
      case 3: symbol = 'three'; break;
      case 4: symbol = 'four'; break;
      case 5: symbol = 'five'; break;
      case 6: symbol = 'six'; break;
      case 7: symbol = 'seven'; break;
      case 8: symbol = 'eight'; break;
      case 9: symbol = 'nine'; break;
      case 0: symbol = 'zero'; break;
    }
    return (
      <div id={symbol} className={'button col-'+this.props.size}>
        <button className={'btn btn-'+this.props.type} onClick={this.props.onClick}>{this.props.symbol}</button>
      </div>
    )
  }
}

class Calculator extends React.Component{
  constructor(props){
    super(props);
    this.currentCalc = React.createRef();
    this.totalDisplay = React.createRef();
    this.state = {
      sum: [],
      currentNumber: '',
      lastChar: null,
      total: 0,
      interface: [
        [
          {symbol: 'AC', size: 6, type: 'danger' },
          {symbol: '/', size: 3, type: 'dark' },
          {symbol: 'x', size: 3, type: 'dark' },
        ],
        [
          {symbol: 7, size: 3, type: 'secondary' },
          {symbol: 8, size: 3, type: 'secondary' },
          {symbol: 9, size: 3, type: 'secondary' },
          {symbol: '-', size: 3, type: 'dark' },
        ],
        [
          {symbol: 4, size: 3, type: 'secondary' },
          {symbol: 5, size: 3, type: 'secondary' },
          {symbol: 6, size: 3, type: 'secondary' },
          {symbol: '+', size: 3, type: 'dark' },
        ],
        [
          [
            {symbol: 1, size: 4, type: 'secondary' },
            {symbol: 2, size: 4, type: 'secondary' },
            {symbol: 3, size: 4, type: 'secondary' },
            {symbol: 0, size: 8, type: 'secondary' },
            {symbol: '.', size: 4, type: 'secondary' }
          ],
          [
            {symbol: '=', size: 12, type: 'success' },
          ]
        ]
      ]
    }
    this.handleClick = this.handleClick.bind(this)
  };


  handleClick(e){
    const currentCalc = this.currentCalc.current
    const totalDisplay = this.totalDisplay.current
    var sum = this.state.sum
    var currentNumber = this.state.currentNumber
    var lastChar = this.state.lastChar
    var total = this.state.total
    //Function used when '=' is pressed
    var calculate = function(sum){
      var math = {
        '/': (x,y) => parseFloat(x)/parseFloat(y),
        'x': (x,y) => parseFloat(x)*parseFloat(y),
        '+': (x,y) => parseFloat(x)+parseFloat(y),
        '-': (x,y) => parseFloat(x)-parseFloat(y),
      }
      for(let op of ['/', 'x', '+', '-']){
        while(sum.includes(op)){
          for(let x in sum){
            if( sum[x] == op ){
              let segment = sum.slice(x-1, x+2)
              let insert = math[op](segment[0], segment[2]) 
              sum.splice(x-1, 3, insert)
            }
          }
        }
      }
      console.log(sum)
      return sum[0]
    }
    console.log(sum)
    //Check length of current calculation
    if(sum.toString().length > 43){
      this.setState({total: 'MAX'})
    }else if(sum.toString().length > 35){
      currentCalc.style.fontSize = '1.25rem';
    }
    else if(sum.toString().length < 40){
      currentCalc.style.fontSize = '1.5rem';
    }

    //Switchboard
    if(total === 'MAX'){
      switch(e){
        case 'AC': 
          this.setState({currentNumber: '', sum:[], total: 0, lastChar: ''}); break;
        case '=':
          calculate(sum);
          this.setState({total: 'MAX', sum:[], lastChar: '', currentNumber: ''}); break;
      }
    } else if(Number.isInteger(e) && sum[0] != '0' || e === '.' && !currentNumber.includes('.') && lastChar != null){
      currentNumber = currentNumber+e
      if('x/-+'.includes(lastChar)){
        sum = sum.concat(currentNumber)
      }else{
        sum = sum.slice(0, sum.length-1).concat(currentNumber)
      }
      this.setState({
        currentNumber: currentNumber,
        sum,
        lastChar: e
      })
    }else{
      switch(e){
        case 'AC': 
          this.setState({currentNumber: '', sum:[], total: 0, lastChar: null}); break;
        case '/': case 'x': case '+': case '-':
          console.log(total)
          if(['/', 'x', '+', '-'].includes(lastChar)){
            sum = sum.slice(0, sum.length-1).concat(e);
            this.setState({sum, lastChar: e}); break;
          }else if(lastChar !== null){
            sum = sum.slice(0, sum.length-1).concat(currentNumber).concat(e);
            this.setState({sum, currentNumber: '', lastChar: e}); break;
          }else if(lastChar === null && total != 0){
            console.log('heya')
            sum = sum.concat(total).concat(e);
            this.setState({sum, total: 0, lastChar:e}); break;
          }else{
            this.setState({total: 0, sum:[], lastChar: null, currentNumber: ''}); break;
          }
        case '=':
          if(lastChar === null){
            this.setState({total: 0, sum:[], lastChar: null, currentNumber: ''}); break;
          }else{
            calculate(sum)
            //Check length of total
            if(sum.toString().length > 22){
              this.setState({total: 'MAX', sum:sum, lastChar: null, currentNumber: ''}); break;
            }else if(sum.toString().length > 16){
              totalDisplay.style.fontSize = '1.25rem'
              this.setState({total: sum, sum:[], lastChar: null, currentNumber: ''}); break;
            }else{
              totalDisplay.style.fontSize = '1.7rem'
              this.setState({total: sum, sum:[], lastChar: null, currentNumber: ''}); break;
            }
          }
      }
    }
  }

  render() {
    return(
      <div id='calculator-body' className='container'>
        <div id='display' className='row'>
          <div id='current-calc' className='row' ref={this.currentCalc}><p>{this.state.sum}</p></div>
          <div id='total' className='row' ref={this.totalDisplay}>{this.state.total}</div>
        </div>
        <div id='first-row' className='row'>
          {this.state.interface[0].map( item =>  
            <Button key={item.symbol} symbol={item.symbol} size={item.size} type={item.type} onClick={() => this.handleClick(item.symbol)}/>  
          )}
        </div>
        <div id='second-row' className='row'>
          {this.state.interface[1].map( item =>
            <Button key={item.symbol} symbol={item.symbol} size={item.size} type={item.type} onClick={() => this.handleClick(item.symbol)}/>
          )}
        </div>
        <div id='third-row' className='row'>
          {this.state.interface[2].map( item =>
            <Button key={item.symbol} symbol={item.symbol} size={item.size} type={item.type} onClick={() => this.handleClick(item.symbol)}/>
          )}
        </div>
        <div id='final-rows' className='row'>
          <div id='fourth-row' className='row'>
            {this.state.interface[3][0].map( item =>
              <Button key={item.symbol} symbol={item.symbol} size={item.size} type={item.type} onClick={() => this.handleClick(item.symbol)}/>
            )}          
          </div>
          <div id='equals-container' className='row'>
            {this.state.interface[3][1].map( item =>
              <Button key={item.symbol} symbol={item.symbol} size={item.size} type={item.type} onClick={() => this.handleClick(item.symbol)}/>
            )} 
          </div>
        </div>
      </div>
    )
  }
}

export default Calculator;
