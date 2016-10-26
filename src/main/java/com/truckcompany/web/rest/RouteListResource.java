package com.truckcompany.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.truckcompany.domain.RouteList;
import com.truckcompany.repository.RouteListRepository;
import com.truckcompany.service.RouteListService;
import com.truckcompany.web.rest.util.HeaderUtil;
import com.truckcompany.web.rest.vm.ManagedRouteListVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Viktor Dobroselsky.
 */

@RestController
@RequestMapping(value = "/api")
public class RouteListResource {

    private final Logger log = LoggerFactory.getLogger(RouteListResource.class);

    @Inject
    private RouteListRepository routeListRepository;

    @Inject
    private RouteListService routeListService;

    @RequestMapping (value = "/routelists",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<RouteList>> getAllRouteList ()  throws URISyntaxException {
        log.debug("REST request get all RouteList");
        List<RouteList> routeLists = routeListRepository.findAll();

        List<ManagedRouteListVM> managedRouteLists = routeLists.stream()
            .map(ManagedRouteListVM::new)
            .collect(Collectors.toList());

        HttpHeaders headers = HeaderUtil.createAlert("routeList.getAll", null);

        return new ResponseEntity(managedRouteLists, headers, HttpStatus.OK);
    }

    @RequestMapping (value = "/routelists/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ManagedRouteListVM> getRouteList (@PathVariable Long id) {
        log.debug("REST request to get RouteList : {}", id);

        RouteList routeList = routeListService.getRouteListById(id);
        if (routeList == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<ManagedRouteListVM>(new ManagedRouteListVM(routeList),HttpStatus.OK);
    }

    @RequestMapping (value = "/routelists",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> createRouteList (@RequestBody ManagedRouteListVM managedRouteListVM)
        throws URISyntaxException {
        log.debug("REST request to save Waybill");
        RouteList newRouteList = routeListService.createRouteList(managedRouteListVM);

        return ResponseEntity.created(new URI("/api/companies/" + newRouteList.getId()))
            .headers(HeaderUtil.createAlert("routeList.created", newRouteList.getId().toString()))
            .body(newRouteList);
    }

    @RequestMapping(value = "/routelists/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity deleteUser(@PathVariable Long id) {
        log.debug("REST request to delete RouteList: {}", id);
        routeListService.deleteRouteList(id);

        return ResponseEntity.ok().headers(HeaderUtil.createAlert( "routelistManagement.deleted", id.toString())).build();
    }

    @RequestMapping (value = "/routelists",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity updateWaybill (@RequestBody ManagedRouteListVM managedRouteListVM) {
        log.debug("REST request to update Waybill : {}", managedRouteListVM);
        RouteList existingWaybill = routeListRepository.findOne(managedRouteListVM.getId());

        if (existingWaybill == null)
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("routelistManagement", "waybilldontexist", "Waybill doesn't exist!")).body(null);

        routeListService.updateRouteList(managedRouteListVM);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createAlert("userManagement.updated", managedRouteListVM.getId().toString()))
            .body(new ManagedRouteListVM(routeListService.getRouteListById(managedRouteListVM.getId())));
    }
}