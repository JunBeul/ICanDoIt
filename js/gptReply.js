export default function getGptReply(inputText){
  //매개변수 inputText를 사용자의 질문으로 사용하면 됩니다.
  // 실제 입력은 "/tempText"형태이지만 inputText의 값은 "tempText"형태로 맨 앞의 "/"이 지워진 상태로 옵니다.

  //해야하는 기능
  //1. get대답 리턴
  //2. 대답 시간이 오래걸리면 그동안 사용자의 동작을 방지할 쿼리, 가능하다면 뷰까지.
  
  //gpt의 대답은 리턴해주면 됩니다.
  return inputText + "에 대한 답을 ai가 대답을 해줬군요!";
}