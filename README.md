Бойлерплейт взят с [github](https://github.com/altv-mango/altv-mango-server-boilerplate)

### Запуск

```shell
pnpm install
npm run server:rel
npm run build
npm run start
```

### Как проверить

Консольные команды `add_buff` и `remove_buff`. Каждая принимает следующие параметры `[entityType] [entityId] [buffType]`.
- **entityType** - `player`/`vehicle`/`ped`
- **buffType** - `Drunk`/`ArmorRegen`/`Invisible`/`Burning`/`MedicalHelp`.

Параметры регистрозависимые

### О решениях

В качестве механизма синхронизации выбрал StreamSyncedMeta, в которую передаю список баффов наложенных на сущность.
Не через обычные ивенты, потому что баффы нужно в любом случае отправлять клиентам в зоне стрима и при входе в стрим запрашивать баффы для сущностей, но через мету просто меньше кода.
В качестве оптимизации сети еще можно было бы добавить в конфиги `shouldSync: boolean`
