import type { Language } from '../../state/language';

const explanations: Record<string, Record<Language, string>> = {
  Introduction: {
    english: 'Let me help you understand this topic. We will start with the basics and build up your knowledge step by step.',
    hindi: 'मैं आपको इस विषय को समझने में मदद करूंगा। हम बुनियादी बातों से शुरू करेंगे और धीरे-धीरे आपका ज्ञान बढ़ाएंगे।',
    marathi: 'मी तुम्हाला हा विषय समजण्यात मदत करेन. आपण मूलभूत गोष्टींपासून सुरुवात करू आणि हळूहळू तुमचे ज्ञान वाढवू.',
  },
  'Key Concepts': {
    english: 'These are the main ideas you need to remember. Focus on understanding each concept clearly before moving forward.',
    hindi: 'ये मुख्य विचार हैं जिन्हें आपको याद रखना है। आगे बढ़ने से पहले प्रत्येक अवधारणा को स्पष्ट रूप से समझने पर ध्यान दें।',
    marathi: 'या मुख्य कल्पना आहेत ज्या तुम्हाला लक्षात ठेवायच्या आहेत. पुढे जाण्यापूर्वी प्रत्येक संकल्पना स्पष्टपणे समजून घ्या.',
  },
  Examples: {
    english: 'Let us look at some examples to make this easier to understand. Examples help us see how things work in real life.',
    hindi: 'आइए इसे समझने में आसान बनाने के लिए कुछ उदाहरण देखें। उदाहरण हमें यह देखने में मदद करते हैं कि वास्तविक जीवन में चीजें कैसे काम करती हैं।',
    marathi: 'हे समजणे सोपे करण्यासाठी काही उदाहरणे पाहूया. उदाहरणे आपल्याला वास्तविक जीवनात गोष्टी कशा कार्य करतात हे पाहण्यास मदत करतात.',
  },
  'Practice Problems': {
    english: 'Now it is time to practice! Try solving these problems yourself. Practice makes you better and more confident.',
    hindi: 'अब अभ्यास करने का समय है! इन समस्याओं को स्वयं हल करने का प्रयास करें। अभ्यास आपको बेहतर और अधिक आत्मविश्वासी बनाता है।',
    marathi: 'आता सराव करण्याची वेळ आली आहे! या समस्या स्वतः सोडवण्याचा प्रयत्न करा. सराव तुम्हाला चांगले आणि अधिक आत्मविश्वासी बनवतो.',
  },
  Summary: {
    english: 'Great job! Let us review what we learned today. Make sure you understand all the main points before finishing.',
    hindi: 'बहुत बढ़िया! आइए आज हमने जो सीखा उसकी समीक्षा करें। समाप्त करने से पहले सुनिश्चित करें कि आप सभी मुख्य बिंदुओं को समझते हैं।',
    marathi: 'छान काम! आज आपण काय शिकलो याचा आढावा घेऊया. संपण्यापूर्वी सर्व मुख्य मुद्दे समजले आहेत याची खात्री करा.',
  },
};

const defaultExplanation: Record<Language, string> = {
  english: 'This is an important part of the topic. Watch the video carefully and try to understand the main ideas.',
  hindi: 'यह विषय का एक महत्वपूर्ण हिस्सा है। वीडियो को ध्यान से देखें और मुख्य विचारों को समझने का प्रयास करें।',
  marathi: 'हा विषयाचा एक महत्त्वाचा भाग आहे. व्हिडिओ काळजीपूर्वक पहा आणि मुख्य कल्पना समजून घेण्याचा प्रयत्न करा.',
};

export function getTeacherExplanation(
  topicName: string,
  selectedPoint: string,
  language: Language
): string {
  return explanations[selectedPoint]?.[language] || defaultExplanation[language];
}
