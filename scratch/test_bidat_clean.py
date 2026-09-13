import os
import re
import pandas as pd
import numpy as np

def clean_bidat_val(val):
    if pd.isna(val) or val is None:
        return np.nan
    v_str = str(val).strip()
    if v_str in ['S/N', 'nan', 'None', '', 'null']:
        return np.nan
    
    # Check range patterns like "Valores entre 1 y 9" or "Entre 1 y 5" or "1 a 5"
    m_entre = re.search(r'(?:Valores\s+entre|entre|Entre)\s+(\d+(?:[\.,]\d+)?)\s+(?:y|a|-)\s+(\d+(?:[\.,]\d+)?)', v_str, re.IGNORECASE)
    if m_entre:
        low = float(m_entre.group(1).replace(',', '.'))
        high = float(m_entre.group(2).replace(',', '.'))
        return (low + high) / 2.0
    
    m_range = re.search(r'^(\d+(?:[\.,]\d+)?)\s*(?:a|-|y)\s*(\d+(?:[\.,]\d+)?)$', v_str, re.IGNORECASE)
    if m_range:
        low = float(m_range.group(1).replace(',', '.'))
        high = float(m_range.group(2).replace(',', '.'))
        return (low + high) / 2.0
        
    # Replace comma decimal
    v_clean = v_str.replace(',', '.')
    try:
        return float(v_clean)
    except ValueError:
        return np.nan

# Test function
test_cases = [
    "Valores entre 1 y 9",
    "Entre 1 a 5",
    "1 a 5",
    "90,06261343",
    "123",
    "S/N",
    None
]

print("Test clean_bidat_val:")
for tc in test_cases:
    print(f"  {repr(tc)} -> {clean_bidat_val(tc)}")
