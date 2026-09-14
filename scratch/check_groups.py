import re
import collections

txt = open(r'D:\17082025\2026\Practica profesional\atlas_vgi_uah\src\js\modulos\ide_chile.js', 'r', encoding='utf-8').read()
grupos = re.findall(r'grupo:\s*[\'"]([^\'"]+)[\'"]', txt)
print('Total grupo occurrences:', len(grupos))
print('Group counts:')
for g, c in collections.Counter(grupos).items():
    print(f'  {g}: {c}')
