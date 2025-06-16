import requests

# L'URL à appeler
url = "http://localhost:3000/ac/api/draw_card?amount=5"

# Token d'authentification
token = "123456789"

# En-têtes pour inclure le token
headers = {"Authorization": f"Bearer {token}"}

# Faire la requête GET
response = requests.get(url, headers=headers)

# Vérifier le résultat
if response.status_code == 200:
    print("Réponse reçue :")
    data = response.json()

    for card in data:
        print("-", card["name"])
else:
    print(f"Erreur {response.status_code}")
