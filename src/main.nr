contract Main {
    use dep::aztec::prelude::{Map, PublicMutable};
    use dep::aztec::test::{helpers::{cheatcodes, test_environment::TestEnvironment}};
    use dep::aztec::protocol_types::storage::map::derive_storage_slot_in_map;
    use dep::aztec::note::note_getter::{MAX_NOTES_PER_PAGE, view_notes};
    use dep::aztec::{
        note::note_viewer_options::NoteViewerOptions,
        oracle::{execution::{get_block_number, get_contract_address}, unsafe_rand::unsafe_rand, storage::storage_read}
    };

    global MAX_FIELDS_LEN = 33;

    #[aztec(storage)]
    struct Storage {
        fields: Map<Field, PublicMutable<[Field; MAX_FIELDS_LEN]>>,
        array: PublicMutable<[Field; MAX_FIELDS_LEN]>, //<=== this won't compile
    }

    #[aztec(public)]
    fn setFields(key: Field, input: [Field; MAX_FIELDS_LEN]) {
        storage.fields.at(key).write(input);
    }

    #[aztec(public)]
    fn getFields(key: Field, index: Field) -> pub Field {
        storage.fields.at(key).read()[index]
    }

    #[test]
    unconstrained fn test_getFields() {
        let mut env = TestEnvironment::new();
        let deployer = env.deploy_self("Main");
        let my_contract_instance = deployer.without_initializer();
        let key = 1;
        let call = Main::at(my_contract_instance.to_address()).setFields(
            1,
            [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33
        ]
        );
        env.call_public(call);
        let block_number = get_block_number();

        let fields_slot = Main::storage().fields.slot;
        let array_slot = derive_storage_slot_in_map(fields_slot, key);
        let value: Field = storage_read(
            my_contract_instance.to_address(),
            array_slot + 32,
            block_number
        );
        std::println(value);
    }
}
