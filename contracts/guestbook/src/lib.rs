#![no_std]

use soroban_sdk::{contractimpl, symbol, map, vec, Address, Env, Vec, Map, BytesN};

pub struct Guestbook;

#[derive(Clone)]
pub struct Message {
    pub author: Address,
    pub text: Vec<u8>,
    pub when: i64,
}

#[contractimpl]
impl Guestbook {
    pub fn write(env: Env, author: Address, text: Vec<u8>) {
        let messages_key = symbol!("messages");
        let mut map: Map<u32, Vec<u8>> = env.storage().instance().get(&messages_key).unwrap_or(Map::new(&env));
        // store concatenated: author + timestamp + text is simplified intentionally
        let count_key = symbol!("count");
        let count: u32 = env.storage().instance().get(&count_key).unwrap_or(0u32);
        let idx = count;
        // store text; we store only text for simplicity — frontends verify authorship using tx signer
        map.set(&idx, &text);
        env.storage().instance().set(&messages_key, &map);
        env.storage().instance().set(&count_key, &(count + 1));
    }

    pub fn get_count(env: Env) -> u32 {
        let count_key = symbol!("count");
        env.storage().instance().get(&count_key).unwrap_or(0u32)
    }

    pub fn get_message(env: Env, idx: u32) -> Vec<u8> {
        let messages_key = symbol!("messages");
        let map: Map<u32, Vec<u8>> = env.storage().instance().get(&messages_key).unwrap_or(Map::new(&env));
        map.get(&idx).unwrap_or(Vec::new(&env))
    }
}

mod test {
    use super::*;
    use soroban_sdk::Env;

    #[test]
    fn test_write_and_read() {
        let env = Env::default();
        let root = env.register_contract(None, Guestbook);
        let client = GuestbookClient::new(&env, &root);
        let text = Vec::from_slice(&env, b"Hello from test");
        let addr = Address::from_contract_id(&env, &BytesN::from_array(&env, &[0;32]));
        client.write(&addr, &text);
        let count = client.get_count();
        assert_eq!(count, 1u32);
        let got = client.get_message(0);
        assert_eq!(got, text);
    }
}
