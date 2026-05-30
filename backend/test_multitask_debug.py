import os
import re
import unicodedata
from pathlib import Path
from typing import Dict

import torch

from model import MULTITASK_MODEL_PATH, load_multitask_model

# 1. CẤU HÌNH CƠ BẢN
# ============================================================
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"💻 Hệ thống chạy trên thiết bị: {DEVICE}")

try:
    CURRENT_DIR = Path(__file__).resolve().parent
except NameError:
    CURRENT_DIR = Path.cwd()

MAX_LEN = int(os.getenv("MAX_LEN", "256"))

VIETNAMESE_STOPWORDS = {
    "và", "của", "là", "những", "các", "cho", "để", "với", "trong", "tại",
    "như", "nhưng", "vì", "thì", "mà", "hoặc", "nếu", "tuy", "đến", "bằng",
    "vẫn", "cứ", "chỉ", "lại", "thôi", "từng", "này", "kia", "đó", "đấy",
    "nào", "ai", "gì", "sao", "ở", "sau", "trước", "khi", "nhà", "người",
    "chuyện", "việc", "cái", "chiếc", "sự", "nỗi", "niềm", "sức",
}

TEENCODE_DICT = {
    "ko": "không", "k": "không", "khg": "không", "khum": "không", "kp": "không phải",
    "đg": "đang", "dg": "đang", "dc": "được", "đc": "được", "đt": "điện thoại",
    "j": "gì", "zi": "vậy", "v": "vậy", "vây": "vậy", "ntn": "như thế nào",
    "ok": "tốt", "oki": "tốt", "oke": "tốt", "gút": "tốt", "good": "tốt",
    "sad": "buồn", "happy": "vui", "iu": "yêu", "love": "yêu",
    "tks": "cảm ơn", "thanks": "cảm ơn", "tk": "cảm ơn", "cmon": "cảm ơn", "cmơn": "cảm ơn",
    "xl": "xin lỗi", "plz": "làm ơn", "please": "làm ơn",
    "b": "bạn", "bán": "bạn", "bn": "bạn", "c": "chị", "a": "anh", "e": "em",
    "m": "mình", "t": "tôi", "mn": "mọi người", "ng": "người", "gđ": "gia đình",
    "nv": "nhân viên", "shop": "cửa hàng", "st": "siêu thị", "kh": "khách hàng",
    "hnay": "hôm nay", "hqua": "hôm qua", "nt": "nhắn tin", "tl": "trả lời",
    "ib": "nhắn tin", "inbox": "nhắn tin", "rep": "trả lời", "fb": "facebook",
    "bit": "biết", "bít": "biết", " bik": "biết", "bh": "bây giờ", "h": "giờ",
    "mún": "muốn", "thik": "thích", "ty": "tình yêu", "chít": "chết",
    " lém": "lắm", " hỉu": "hiểu", " rùi": "rồi", " r": "rồi", " thui": "thôi",
    " đc ": " được ", " wa ": " quá ", " ship ": " giao hàng ",
    " shipper ": " người giao hàng ", " order ": " đặt hàng ",
}


def _replace_teencode(text: str) -> str:
    words = text.split()
    return " ".join([TEENCODE_DICT.get(word, word) for word in words])


def preprocess_review_text(text: str) -> str:
    if text is None:
        return ""

    normalized_text = str(text).strip().lower()
    if not normalized_text or normalized_text == "nan":
        return ""

    normalized_text = unicodedata.normalize("NFC", normalized_text)
    normalized_text = re.sub(r"https?://\S+|www\.\S+", " ", normalized_text)
    normalized_text = re.sub(r"\S+@\S+", " ", normalized_text)
    normalized_text = re.sub(r"\b\d{8,}\b", " ", normalized_text)
    normalized_text = re.sub(
        r"([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễđìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ])\1+",
        r"\1",
        normalized_text,
    )
    normalized_text = re.sub(
        r"[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễđìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ\s]",
        " ",
        normalized_text,
    )
    normalized_text = re.sub(r"\s+", " ", normalized_text).strip()
    normalized_text = _replace_teencode(normalized_text)

    try:
        from pyvi import ViTokenizer

        normalized_text = ViTokenizer.tokenize(normalized_text)
    except Exception:
        pass

    filtered_words = [word for word in normalized_text.split() if word not in VIETNAMESE_STOPWORDS]
    return " ".join(filtered_words)


def default_multitask_scores() -> Dict[str, Dict[str, float]]:
    return {
        "sentiment": {
            "negative": 0.0,
            "neutral": 0.0,
            "positive": 0.0,
        },
        "helpfulness": {
            "key_aspects": 0.0,
            "advice": 0.0,
            "total": 0.0,
        },
    }


def debug_multitask_text(text: str) -> Dict[str, Dict[str, float]]:
    model, tokenizer = load_multitask_model()
    print("MULTITASK_MODEL_PATH:", MULTITASK_MODEL_PATH)
    print("model:", type(model))
    print("tokenizer class:", None if tokenizer is None else tokenizer.__class__.__name__)

    if model is None or tokenizer is None:
        return default_multitask_scores()

    # Kaggle-style inference should use the raw review text as closely as possible.
    # Keep preprocessing only as an optional reference, not as the model input.
    cleaned_text = str(text or "").strip()
    print("raw_text:", cleaned_text)
    print("preprocessed_text:", preprocess_review_text(text))

    inputs = tokenizer(
        cleaned_text,
        return_tensors="pt",
        padding="max_length",
        truncation=True,
        max_length=MAX_LEN,
    )
    print("input_ids shape:", inputs["input_ids"].shape)
    print("attention_mask shape:", inputs["attention_mask"].shape)

    input_ids = inputs["input_ids"].to(DEVICE)
    attention_mask = inputs["attention_mask"].to(DEVICE)

    with torch.no_grad():
        help_preds, sent_logits = model.forward(input_ids, attention_mask)

    print("help_preds:", help_preds)
    print("sent_logits:", sent_logits)

    help_preds_01 = torch.clamp(help_preds, 0.0, 1.0).cpu().numpy()[0]
    probs = torch.softmax(sent_logits, dim=1)[0].cpu().numpy()

    result = {
        "sentiment": {
            "negative": float(probs[0]),
            "neutral": float(probs[1]),
            "positive": float(probs[2]),
        },
        "helpfulness": {
            "key_aspects": float(help_preds_01[0]),
            "advice": float(help_preds_01[1]),
            "total": float((help_preds_01[0] + help_preds_01[1]) / 2.0),
        },
        "sentiment_label": int(torch.argmax(sent_logits, dim=1)[0].item()),
    }

    print("Helpfulness key_aspects:", result["helpfulness"]["key_aspects"])
    print("Helpfulness advice:", result["helpfulness"]["advice"])
    print("Helpfulness total:", result["helpfulness"]["total"])
    print("Sentiment negative:", result["sentiment"]["negative"])
    print("Sentiment neutral:", result["sentiment"]["neutral"])
    print("Sentiment positive:", result["sentiment"]["positive"])
    print("Sentiment label (argmax):", result["sentiment_label"])

    return result


def main() -> None:
    text = input("Nhập câu cần kiểm tra: ").strip()
    if not text:
        print("Không có nội dung để kiểm tra.")
        return

    debug_multitask_text(text)


if __name__ == "__main__":
    main()
