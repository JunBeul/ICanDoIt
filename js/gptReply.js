export default function getGptReply(inputText){
  //매개변수 inputText를 사용자의 질문으로 사용하면 됩니다.
  // 실제 입력은 "/tempText"형태이지만 inputText의 값은 "tempText"형태로 맨 앞의 "/"이 지워진 상태로 옵니다.
  
  //해야하는 기능
  //1. get대답 리턴
  public String getGptReply(String inputText) {
    String reply = "";
    try {
        reply = processNaturalLanguage(inputText);
    } catch (Exception e) {

        e.printStackTrace();
    }
    return reply;
  }
  
  //2. 대답 시간이 오래걸리면 그동안 사용자의 동작을 방지할 쿼리, 가능하다면 뷰까지.
  public void createView(Context context) {
    View view = new View(context);
    view.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

    // 메시지 노출을 위한 텍스트뷰 생성
    TextView textView = new TextView(context);
    textView.setText("입력중 입니다.잠시만 기다려주세요.");
    textView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
    view.addView(textView);

    setContentView(view);
}
  
  //gpt의 대답은 리턴해주면 됩니다.
  return inputText + "에 대한 답을 ai가 대답을 해줬군요!";
}
