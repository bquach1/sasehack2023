import openai

# Set your OpenAI API key
api_key = "YOUR_API_KEY_HERE"
openai.api_key = "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"

def chat_with_bot(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a mental health support chatbot."},
            {"role": "user", "content": prompt}
        ]
    )
    return response['choices'][0]['message']['content']

# Main loop for chatting with the mental health chatbot
print("Chat with the Mental Health Chatbot. Type 'exit' to end the conversation.")
while True:
    user_input = input("You: ")
    if user_input.lower() == 'exit':
        break

    # Ensure the user input is related to mental health
    if "mental health" not in user_input:
        print("Bot: I'm here to discuss mental health topics. Please feel free to share your thoughts or concerns related to mental health.")
        continue

    bot_response = chat_with_bot(user_input)

    print("Bot:", bot_response)