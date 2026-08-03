import { Component ,viewChild,ElementRef,AfterViewChecked, ViewChild,ChangeDetectorRef} from '@angular/core';
import { RagService } from '../services/rag-service';

interface ChatMessage{
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chat-bot',
  standalone: false,
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.css',
  
})



export class ChatBot implements AfterViewChecked {
  
  query : string = '';
  isLoadingBot : boolean = false;
  isOpen: boolean = false;

  messages: ChatMessage[] = []
  
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  constructor(
    private ragService: RagService,
    private cdr: ChangeDetectorRef
  ){}
  
  

  ngAfterViewChecked(): void {
  }

  closeChat(){
    this.isOpen=false;
   
  }
  openChat(){
    this.isOpen = true;
    this.restartConversation()
    
  }
  private scrollToBottom():void{
    try{
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch(err){}
  }


  ragChat(){
    const trimmedQuery = this.query.trim();

    if (!this.query.trim() || this.isLoadingBot) {
      return;
    }
    this.messages.push({sender:'user', text:trimmedQuery});
    this.query ='';
    this.isLoadingBot = true;

    this.ragService.chat(trimmedQuery).subscribe({
      next: (data) => {
        this.messages.push({sender:'bot',text:data.answer});
        this.isLoadingBot = false;
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Errore RAG chat:', err);
        this.messages.push({sender:'bot',text:'Mi dispiace si è verificato un errore, prova più tardi'})
        this.isLoadingBot = false;
        this.cdr.detectChanges()
      }
    });
  }


  restartConversation(){
    this.messages = [];
    this.isLoadingBot = false;
    this.query = '';

    this.messages.push({sender:'bot',text:'Ciao, sono il tuo consulente culinario Reggie. Come posso esserti di aiuto? :) '})
  }
  
}
