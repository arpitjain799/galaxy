<template>
    <UserHistories
        v-if="currentUser"
        v-slot="{ currentHistory, histories, handlers, historiesLoading }"
        :user="currentUser">
        <div v-if="currentHistory" id="current-history-panel" class="d-flex flex-column history-index">
            <CurrentHistory
                v-if="!breadcrumbs.length"
                :list-offset="listOffset"
                :history="currentHistory"
                :filterable="true"
                v-on="handlers"
                @view-collection="onViewCollection">
                <template v-slot:navigation>
                    <HistoryNavigation
                        :history="currentHistory"
                        :histories="histories"
                        :histories-loading="historiesLoading"
                        title="Histories"
                        v-on="handlers" />
                </template>
            </CurrentHistory>
            <CurrentCollection
                v-else-if="breadcrumbs.length"
                :history="currentHistory"
                :selected-collections.sync="breadcrumbs"
                @view-collection="onViewCollection" />
            <div v-else>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else class="flex-grow-1 loadingBackground h-100">
            <span v-localize class="sr-only">Loading History...</span>
        </div>
    </UserHistories>
</template>

<script>
import { mapState } from "pinia";
import { useUserStore } from "@/stores/userStore";
import UserHistories from "components/providers/UserHistories";
import HistoryNavigation from "./CurrentHistory/HistoryNavigation";
import CurrentHistory from "./CurrentHistory/HistoryPanel";
import CurrentCollection from "./CurrentCollection/CollectionPanel";

export default {
    components: {
        CurrentHistory,
        CurrentCollection,
        UserHistories,
        HistoryNavigation,
    },
    data() {
        return {
            // list of collections we have drilled down into
            breadcrumbs: [],
            listOffset: 0,
        };
    },
    computed: {
        ...mapState(useUserStore, ["currentUser"]),
    },
    methods: {
        onViewCollection(collection, currentOffset) {
            this.listOffset = currentOffset;
            this.breadcrumbs = [...this.breadcrumbs, collection];
        },
    },
};
</script>
