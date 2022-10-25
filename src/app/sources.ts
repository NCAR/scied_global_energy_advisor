interface ISource {
  name: string,
  amount: number
}

export interface ISources {
  [id: string]: ISource
}
