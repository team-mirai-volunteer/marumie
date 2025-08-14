# sankey
- sankey chart 
    - https://nivo.rocks/sankey/
- correct data looks like
    ```
    {
  "nodes": [
    {
      "id": "John",
      "nodeColor": "hsl(256, 70%, 50%)"
    },
    {
      "id": "Raoul",
      "nodeColor": "hsl(86, 70%, 50%)"
    },
    {
      "id": "Jane",
      "nodeColor": "hsl(208, 70%, 50%)"
    },
    {
      "id": "Marcel",
      "nodeColor": "hsl(55, 70%, 50%)"
    },
    {
      "id": "Ibrahim",
      "nodeColor": "hsl(184, 70%, 50%)"
    },
    {
      "id": "Junko",
      "nodeColor": "hsl(193, 70%, 50%)"
    }
  ],
  "links": [
    {
      "source": "Ibrahim",
      "target": "John",
      "value": 60
    },
    {
      "source": "Marcel",
      "target": "Ibrahim",
      "value": 189
    },
    {
      "source": "Marcel",
      "target": "Jane",
      "value": 149
    },
    {
      "source": "Marcel",
      "target": "Raoul",
      "value": 141
    },
    {
      "source": "John",
      "target": "Junko",
      "value": 98
    },
    {
      "source": "Junko",
      "target": "Jane",
      "value": 47
    },
    {
      "source": "Junko",
      "target": "Raoul",
      "value": 87
    },
    {
      "source": "Jane",
      "target": "Raoul",
      "value": 45
    }
  ]
}
    ```

- so in our case, we want the
    - nodes to be **unique** values (so we see a big "広告宣伝費" for example)
    - links to be each value in the transaction table

- because we have 2 layers, the node/links should also have 2 layers
    - OUT
        - first link ACOUNT -> debitAccount (amount)
        - second link debitAcount -> debitDetail (amount)
    - IN
        - NOT YET (add first link later, id->寄附金(creditAccount?))
        - creditAccount -> ACOUNT
t
