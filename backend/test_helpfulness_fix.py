import sys
sys.path.insert(0, '.')
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer
from model import PhoBertMultiTaskModel

device = 'cpu'
tokenizer = AutoTokenizer.from_pretrained('vinai/phobert-base')
model = PhoBertMultiTaskModel(device=device)

# Load weights properly
state_dict = torch.load('./saved_model/phobert_multitask_best (2).pt', map_location=device)
model.phobert.load_state_dict({k.replace('phobert.', ''): v for k, v in state_dict.items() if k.startswith('phobert.')}, strict=False)
model.sentiment_head.load_state_dict({k.replace('sentiment_head.', ''): v for k, v in state_dict.items() if k.startswith('sentiment_head.')}, strict=False)
model.helpfulness_head.load_state_dict({k.replace('helpfulness_head.', ''): v for k, v in state_dict.items() if k.startswith('helpfulness_head.')}, strict=False)
model.eval()

test_text = 'cửa_hàng_phục_vụ rất kémko có đạo_đức nghề_nghiệp'
inputs = tokenizer(test_text, add_special_tokens=True, max_length=256, padding='max_length', truncation=True, return_tensors='pt')
input_ids = inputs['input_ids'].to(device)
attention_mask = inputs['attention_mask'].to(device)

with torch.no_grad():
    help_preds, sent_logits = model.forward(input_ids, attention_mask)
    help_clamped = torch.clamp(help_preds, 0.0, 1.0).cpu().numpy()[0]
    sent_probs = F.softmax(sent_logits, dim=1)[0].cpu().numpy()

print(f'INPUT: {test_text}')
print(f'\nHELPFULNESS (clamped to [0,1]):')
print(f'  key_aspects: {float(help_clamped[0]):.4f}')
print(f'  advice: {float(help_clamped[1]):.4f}')
print(f'  total: {(float(help_clamped[0])+float(help_clamped[1]))/2:.4f}')
print(f'\nSENTIMENT:')
print(f'  negative: {float(sent_probs[0]):.4f}')
print(f'  neutral: {float(sent_probs[1]):.4f}')
print(f'  positive: {float(sent_probs[2]):.4f}')
print(f'\nEXPECTED FROM CSV:')
print(f'  helpfulness: 0.18')
print(f'  sentiment: negative=1.0, neutral=0.0, positive=0.0')
